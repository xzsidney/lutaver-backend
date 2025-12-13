import { prisma } from '../../prisma/client';
import { hashToken } from '../../utils/hash';

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

/**
 * Serviço para gerenciamento de refresh tokens
 * Responsável por CRUD de tokens e limpeza de tokens expirados
 */
export const refreshTokenService = {
    /**
     * Cria um novo refresh token no banco de dados
     * Armazena apenas o hash do token, nunca em texto puro
     */
    async create(
        userId: string,
        token: string,
        userAgent?: string,
        ipAddress?: string
    ) {
        const tokenHash = hashToken(token);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

        return await prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
                userAgent,
                ipAddress,
            },
        });
    },

    /**
     * Revoga um refresh token específico
     * Usado no logout single
     */
    async revoke(tokenHash: string) {
        return await prisma.refreshToken.update({
            where: { tokenHash },
            data: { revokedAt: new Date() },
        });
    },

    /**
     * Revoga todos os refresh tokens ativos de um usuário
     * Usado no logout global e quando replay attack é detectado
     */
    async revokeAllForUser(userId: string) {
        return await prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    },

    /**
     * Remove refresh tokens expirados do banco de dados
     * Deve ser executado periodicamente (via cron job)
     */
    async cleanupExpired() {
        return await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
    },
};
