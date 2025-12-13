import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { authService } from '../modules/auth/auth.service';

export interface Context {
    req: Request;
    res: Response;
    accessToken?: string;
    user?: User; // Usuário autenticado (se houver token válido)
    userAgent?: string;
    ip?: string;
}

/**
 * Cria o context do GraphQL
 * Extrai access token do header Authorization
 * Extrai user agent e IP para auditoria
 * Tenta autenticar o usuário se houver token
 */
export async function createContext({
    req,
    res,
}: {
    req: Request;
    res: Response;
}): Promise<Context> {
    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.replace('Bearer ', '');

    let user: User | undefined;

    // Tentar autenticar se houver token
    if (accessToken) {
        try {
            user = await authService.getUserFromAccessToken(accessToken);
        } catch (error) {
            // Token inválido, mas não bloqueia a requisição
            // Deixa o resolver decidir se autenticação é obrigatória
            user = undefined;
        }
    }

    return {
        req,
        res,
        accessToken: accessToken || undefined,
        user, // Usuário autenticado anexado ao context
        userAgent: req.headers['user-agent'],
        ip: req.ip,
    };
}
