# LUTAVER Backend - Sistema de Autenticação

Backend GraphQL seguro para a plataforma educacional gamificada LUTAVER.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **GraphQL** com Apollo Server
- **Prisma ORM** + MySQL
- **JWT** (Access + Refresh Token)
- **Express** + Cookies httpOnly
- **bcrypt** para hash de senhas

## 🔐 Segurança

- ✅ Access token em memória (15min)
- ✅ Refresh token em httpOnly cookie (7 dias)
- ✅ Refresh token rotation
- ✅ Detecção de replay attack
- ✅ Invalidação global com tokenVersion
- ✅ CORS configurado com credentials
- ✅ Senhas com bcrypt (10 rounds)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar .env.example para .env
copy .env.example .env

# Editar .env com suas configurações
# Importante: altere os secrets JWT em produção!

# Gerar Prisma Client
npm run prisma:generate

# Criar banco de dados e rodar migrations
npm run prisma:migrate
```

## 🏃 Executar

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## 🗄️ Banco de Dados

```bash
# Abrir Prisma Studio (interface visual do banco)
npm run prisma:studio

# Criar nova migration
npm run prisma:migrate
```

## 📝 GraphQL API

### Mutations

#### `register`
Cria novo usuário.

```graphql
mutation {
  register(input: {
    name: "João Silva"
    email: "joao@lutaver.com"
    password: "senha123"
  }) {
    accessToken
    user {
      id
      name
      email
      role
    }
  }
}
```

#### `login`
Autenticação de usuário.

```graphql
mutation {
  login(input: {
    email: "joao@lutaver.com"
    password: "senha123"
  }) {
    accessToken
    user {
      id
      name
    }
  }
}
```

#### `refreshToken`
Renova access token (usa cookie httpOnly automaticamente).

```graphql
mutation {
  refreshToken {
    accessToken
    user {
      id
      name
    }
  }
}
```

#### `logout`
Revoga refresh token atual.

```graphql
mutation {
  logout
}
```

#### `logoutAll`
Revoga todos os tokens do usuário (todos os dispositivos).

```graphql
mutation {
  logoutAll
}
```

### Queries

#### `me`
Retorna usuário autenticado (requer header Authorization).

```graphql
query {
  me {
    id
    name
    email
    role
    createdAt
  }
}
```

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

## 🏗️ Estrutura do Projeto

```
backend/
├── prisma/
│   └── schema.prisma          # Modelos do banco de dados
├── src/
│   ├── config/
│   │   ├── env.ts             # Validação de variáveis de ambiente
│   │   └── jwt.ts             # Helpers JWT
│   ├── graphql/
│   │   ├── schema.ts          # Schema GraphQL
│   │   ├── resolvers.ts       # Resolvers combinados
│   │   └── context.ts         # Context do GraphQL
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.types.ts
│   │   │   ├── auth.service.ts    # Lógica de negócio
│   │   │   └── auth.resolvers.ts  # Resolvers GraphQL
│   │   └── refreshToken/
│   │       └── refreshToken.service.ts
│   ├── prisma/
│   │   └── client.ts          # Instância Prisma Client
│   ├── utils/
│   │   ├── errors.ts          # Erros GraphQL padronizados
│   │   └── hash.ts            # Hash de tokens
│   ├── index.ts
│   └── server.ts              # Configuração Apollo Server
└── package.json
```

## 🔒 Fluxo de Autenticação

1. **Registro/Login**:
   - Usuário envia credenciais
   - Backend valida e gera access + refresh tokens
   - Access token retornado no response
   - Refresh token definido em httpOnly cookie

2. **Requisições Autenticadas**:
   - Cliente envia access token no header Authorization
   - Backend valida token e tokenVersion
   - Retorna dados solicitados

3. **Refresh Token**:
   - Quando access token expira (15min)
   - Cliente chama mutation refreshToken
   - Backend lê refresh token do cookie
   - Valida, revoga token antigo (rotation)
   - Gera novos tokens
   - Retorna novo access token

4. **Logout**:
   - `logout`: Revoga refresh token atual
   - `logoutAll`: Revoga todos + incrementa tokenVersion

## ⚠️ Produção

Antes de deploy em produção:

1. Altere `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET`
2. Configure `DATABASE_URL` com banco produção
3. Defina `NODE_ENV=production`
4. Configure `FRONTEND_URL` com domínio real
5. Use HTTPS (necessário para cookies secure)
