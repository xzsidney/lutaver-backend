import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
import { env } from './config/env';

async function startServer() {
    const app = express();

    // Criar Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (formattedError, error) => {
            // Log de erros em desenvolvimento
            if (env.NODE_ENV === 'development') {
                console.error('GraphQL Error:', error);
            }
            return formattedError;
        },
    });

    await server.start();

    // Middlewares
    app.use(
        '/graphql',
        cors({
            origin: env.FRONTEND_URL,
            credentials: true, // Permite cookies
        }),
        cookieParser(), // Necessário para ler cookies
        express.json(),
        expressMiddleware(server, {
            context: createContext,
        })
    );

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Iniciar servidor
    app.listen(env.PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${env.PORT}/graphql`);
        console.log(`🏥 Health check at http://localhost:${env.PORT}/health`);
    });
}

startServer().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
