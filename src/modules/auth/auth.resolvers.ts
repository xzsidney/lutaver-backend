import { authService } from './auth.service';
import { Context } from '../../graphql/context';
import { createAuthenticationError } from '../../utils/errors';
import { RegisterInput, LoginInput } from './auth.types';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 dias

/**
 * Resolvers GraphQL de autenticação
 * Gerenciam cookies httpOnly para refresh tokens
 */
export const authResolvers = {
    Query: {
        /**
         * Query me - retorna usuário autenticado
         * Requer header Authorization com access token
         */
        me: async (_: unknown, __: unknown, context: Context) => {
            if (!context.accessToken) {
                throw createAuthenticationError('Não autenticado');
            }

            return await authService.getUserFromAccessToken(context.accessToken);
        },
    },

    Mutation: {
        /**
         * Mutation register - cria novo usuário
         * Define refresh token em httpOnly cookie
         * Retorna access token e dados do usuário
         */
        register: async (
            _: unknown,
            { input }: { input: RegisterInput },
            context: Context
        ) => {
            const result = await authService.register(
                input,
                context.userAgent,
                context.ip
            );

            // Definir refresh token em httpOnly cookie
            context.res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/graphql',
                maxAge: COOKIE_MAX_AGE,
            });

            return {
                accessToken: result.accessToken,
                user: result.user,
            };
        },

        /**
         * Mutation login - autentica usuário existente
         * Define refresh token em httpOnly cookie
         * Retorna access token e dados do usuário
         */
        login: async (
            _: unknown,
            { input }: { input: LoginInput },
            context: Context
        ) => {
            const result = await authService.login(
                input,
                context.userAgent,
                context.ip
            );

            context.res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/graphql',
                maxAge: COOKIE_MAX_AGE,
            });

            return {
                accessToken: result.accessToken,
                user: result.user,
            };
        },

        /**
         * Mutation refreshToken - renova access token
         * Lê refresh token do cookie httpOnly
         * Implementa rotation: revoga token antigo, cria novo
         * Define novo refresh token em cookie
         */
        refreshToken: async (_: unknown, __: unknown, context: Context) => {
            const oldRefreshToken = context.req.cookies[REFRESH_TOKEN_COOKIE];

            if (!oldRefreshToken) {
                throw createAuthenticationError('Refresh token não encontrado');
            }

            const result = await authService.refreshTokens(
                oldRefreshToken,
                context.userAgent,
                context.ip
            );

            context.res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/graphql',
                maxAge: COOKIE_MAX_AGE,
            });

            return {
                accessToken: result.accessToken,
                user: result.user,
            };
        },

        /**
         * Mutation logout - revoga refresh token atual
         * Limpa cookie httpOnly
         */
        logout: async (_: unknown, __: unknown, context: Context) => {
            const refreshToken = context.req.cookies[REFRESH_TOKEN_COOKIE];

            if (refreshToken) {
                await authService.logout(refreshToken);
            }

            context.res.clearCookie(REFRESH_TOKEN_COOKIE, {
                path: '/graphql',
            });

            return true;
        },

        /**
         * Mutation logoutAll - revoga todos os tokens do usuário
         * Incrementa tokenVersion para invalidar access tokens existentes
         * Limpa cookie httpOnly
         */
        logoutAll: async (_: unknown, __: unknown, context: Context) => {
            if (!context.accessToken) {
                throw createAuthenticationError('Não autenticado');
            }

            const user = await authService.getUserFromAccessToken(
                context.accessToken
            );
            await authService.logoutAll(user.id);

            context.res.clearCookie(REFRESH_TOKEN_COOKIE, {
                path: '/graphql',
            });

            return true;
        },
    },
};
