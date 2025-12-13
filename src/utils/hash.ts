import crypto from 'crypto';

/**
 * Gera hash SHA-256 de um token.
 * Usado para armazenar refresh tokens de forma segura no banco de dados.
 * @param token - Token a ser hashado
 * @returns Hash hexadecimal do token
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}
