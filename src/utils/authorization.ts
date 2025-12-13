import { GraphQLError } from 'graphql';
import { Context } from '../graphql/context';

export enum UserRole {
    ADMIN = 'ADMIN',
    PLAYER = 'PLAYER',
    TEACHER = 'TEACHER',
}

/**
 * Valida se o usuário autenticado tem o role necessário
 * Deve ser chamado no início dos resolvers protegidos
 * 
 * @throws GraphQLError UNAUTHENTICATED se não estiver autenticado
 * @throws GraphQLError FORBIDDEN se não tiver o role correto
 */
export function requireRole(context: Context, allowedRoles: UserRole[]): void {
    // Verificar se está autenticado
    if (!context.user) {
        throw new GraphQLError('Não autenticado', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }

    // Verificar se tem o role correto
    if (!allowedRoles.includes(context.user.role as UserRole)) {
        throw new GraphQLError(
            'Acesso negado. Você não tem permissão para acessar este recurso.',
            {
                extensions: {
                    code: 'FORBIDDEN',
                    requiredRoles: allowedRoles,
                    userRole: context.user.role,
                },
            }
        );
    }
}

/**
 * Atalhos para roles específicos
 */
export const requireAdmin = (context: Context) =>
    requireRole(context, [UserRole.ADMIN]);

export const requirePlayer = (context: Context) =>
    requireRole(context, [UserRole.PLAYER]);

export const requireTeacher = (context: Context) =>
    requireRole(context, [UserRole.TEACHER]);

/**
 * Permite múltiplos roles (ex: Admin OU Teacher)
 */
export const requireAnyRole = (context: Context, roles: UserRole[]) =>
    requireRole(context, roles);
