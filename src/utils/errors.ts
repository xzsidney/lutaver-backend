import { GraphQLError } from 'graphql';

/**
 * Cria um erro GraphQL padronizado para autenticação
 */
export function createAuthenticationError(message: string): GraphQLError {
    return new GraphQLError(message, {
        extensions: { code: 'UNAUTHENTICATED' },
    });
}

/**
 * Cria um erro GraphQL padronizado para autorização
 */
export function createForbiddenError(message: string): GraphQLError {
    return new GraphQLError(message, {
        extensions: { code: 'FORBIDDEN' },
    });
}

/**
 * Cria um erro GraphQL padronizado para input inválido
 */
export function createBadInputError(message: string): GraphQLError {
    return new GraphQLError(message, {
        extensions: { code: 'BAD_USER_INPUT' },
    });
}

/**
 * Cria um erro GraphQL padronizado para rate limit
 */
export function createRateLimitError(fieldName: string): GraphQLError {
    return new GraphQLError(
        `Muitas tentativas em ${fieldName}. Tente novamente mais tarde.`,
        {
            extensions: { code: 'RATE_LIMIT_EXCEEDED' },
        }
    );
}
