import { requirePlayer } from '../../utils/authorization';
import { Context } from '../../graphql/context';

/**
 * Resolvers exclusivos para Player
 * Todas as queries/mutations aqui requerem role PLAYER
 */
export const playerResolvers = {
    Query: {
        /**
         * Retorna dados do perfil do jogador autenticado
         * Inclui nível, XP, moedas (mockado por enquanto)
         */
        myPlayerProfile: async (_: unknown, __: unknown, context: Context) => {
            requirePlayer(context);

            // Por enquanto retornando dados mockados
            // Futuramente integrar com tabela de personagens/progresso
            return {
                userId: context.user!.id,
                name: context.user!.name,
                level: 1,
                xp: 0,
                coins: 100,
                characterName: 'Aventureiro',
            };
        },
    },
};
