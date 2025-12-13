import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '@prisma/client';
import { createAuthenticationError } from '../utils/errors';
import { env } from './env';

interface AccessTokenPayload {
    userId: string;
    email: string;
    role: string;
    tokenVersion: number;
}

interface RefreshTokenPayload {
    userId: string;
    tokenVersion: number;
    tokenId: string;
}

/**
 * Gera um access token JWT de curta duração (15 minutos)
 * Inclui informações do usuário e tokenVersion para invalidação
 */
export function generateAccessToken(user: User): string {
    const payload: AccessTokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion,
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
}

/**
 * Gera um refresh token JWT de longa duração (7 dias)
 * Armazenado em httpOnly cookie, usado apenas para renovar access token
 */
export function generateRefreshToken(user: User): string {
    const payload: RefreshTokenPayload = {
        userId: user.id,
        tokenVersion: user.tokenVersion,
        tokenId: crypto.randomUUID(),
    };

    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
}

/**
 * Verifica e decodifica um access token
 * Lança erro se token inválido ou expirado
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    } catch (error) {
        throw createAuthenticationError('Token inválido ou expirado');
    }
}

/**
 * Verifica e decodifica um refresh token
 * Lança erro se token inválido ou expirado
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch (error) {
        throw createAuthenticationError('Token inválido ou expirado');
    }
}
