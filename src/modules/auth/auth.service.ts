import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../../config/jwt';
import { refreshTokenService } from '../refreshToken/refreshToken.service';
import {
    createAuthenticationError,
    createBadInputError,
} from '../../utils/errors';
import { hashToken } from '../../utils/hash';
import { RegisterInput, LoginInput } from './auth.types';

const BCRYPT_ROUNDS = 10;

/**
 * Serviço de autenticação
 * Contém toda a lógica de negócio para registro, login, refresh e logout
 */
export const authService = {
    /**
     * Registra um novo usuário
     * 1. Valida email único
     * 2. Hash de senha com bcrypt
     * 3. Cria usuário no banco
     * 4. Gera tokens JWT
     * 5. Salva refresh token no banco
     */
    async register(input: RegisterInput, userAgent?: string, ip?: string) {
        // Validar email único
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            throw createBadInputError('Email já cadastrado');
        }

        // Hash de senha
        const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name: input.name,
                email: input.email,
                passwordHash,
            },
        });

        // Gerar tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Salvar refresh token
        await refreshTokenService.create(user.id, refreshToken, userAgent, ip);

        return {
            accessToken,
            refreshToken,
            user,
        };
    },

    /**
     * Autentica um usuário existente
     * 1. Busca usuário por email
     * 2. Compara senha com hash
     * 3. Gera tokens JWT
     * 4. Salva refresh token no banco
     */
    async login(input: LoginInput, userAgent?: string, ip?: string) {
        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (!user) {
            // Mensagem genérica para não revelar se email existe
            throw createAuthenticationError('Email ou senha inválidos');
        }

        // Comparar senha
        const isValid = await bcrypt.compare(input.password, user.passwordHash);

        if (!isValid) {
            throw createAuthenticationError('Email ou senha inválidos');
        }

        // Gerar tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Salvar refresh token
        await refreshTokenService.create(user.id, refreshToken, userAgent, ip);

        return {
            accessToken,
            refreshToken,
            user,
        };
    },

    /**
     * Renova tokens usando refresh token (ROTATION)
     * 1. Verifica JWT do refresh token
     * 2. Busca usuário
     * 3. Valida tokenVersion (para invalidação global)
     * 4. Busca refresh token no banco
     * 5. Detecta replay attack (token já revogado)
     * 6. Revoga token antigo
     * 7. Gera novos tokens
     * 8. Salva novo refresh token
     */
    async refreshTokens(
        oldRefreshToken: string,
        userAgent?: string,
        ip?: string
    ) {
        // Verificar JWT
        const payload = verifyRefreshToken(oldRefreshToken);

        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw createAuthenticationError('Usuário não encontrado');
        }

        // Validar tokenVersion
        if (payload.tokenVersion !== user.tokenVersion) {
            throw createAuthenticationError('Token inválido');
        }

        // Buscar refresh token no banco
        const tokenHash = hashToken(oldRefreshToken);
        const storedToken = await prisma.refreshToken.findUnique({
            where: { tokenHash },
        });

        // Verificar se token existe
        if (!storedToken) {
            throw createAuthenticationError('Token inválido');
        }

        // DETECÇÃO DE REPLAY ATTACK
        if (storedToken.revokedAt) {
            // Token já foi usado! Invalidar todas as sessões do usuário
            await refreshTokenService.revokeAllForUser(user.id);
            await prisma.user.update({
                where: { id: user.id },
                data: { tokenVersion: { increment: 1 } },
            });

            throw createAuthenticationError(
                'Token comprometido. Faça login novamente.'
            );
        }

        // Verificar expiração
        if (storedToken.expiresAt < new Date()) {
            throw createAuthenticationError('Token expirado');
        }

        // ROTATION: Revogar token antigo
        await refreshTokenService.revoke(tokenHash);

        // Gerar novos tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Salvar novo refresh token
        await refreshTokenService.create(user.id, newRefreshToken, userAgent, ip);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user,
        };
    },

    /**
     * Logout single - revoga apenas o refresh token atual
     */
    async logout(refreshToken: string) {
        const tokenHash = hashToken(refreshToken);
        await refreshTokenService.revoke(tokenHash);
        return true;
    },

    /**
     * Logout global - revoga todos os tokens e incrementa tokenVersion
     * Força re-login em todos os dispositivos
     */
    async logoutAll(userId: string) {
        await refreshTokenService.revokeAllForUser(userId);
        await prisma.user.update({
            where: { id: userId },
            data: { tokenVersion: { increment: 1 } },
        });
        return true;
    },

    /**
     * Retorna usuário autenticado a partir do access token
     * Valida tokenVersion para invalidação global
     */
    async getUserFromAccessToken(accessToken: string) {
        const payload = verifyAccessToken(accessToken);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw createAuthenticationError('Usuário não encontrado');
        }

        // Validar tokenVersion
        if (payload.tokenVersion !== user.tokenVersion) {
            throw createAuthenticationError('Token inválido');
        }

        return user;
    },
};
