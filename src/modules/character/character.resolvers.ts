import { GraphQLError } from 'graphql';
import { Context } from '../../graphql/context';
import { characterService } from './character.service';
import type {
    CreateCharacterInput,
    UpdateCharacterInput,
} from './character.types';

export const characterResolvers = {
    Query: {
        // Retorna o único personagem do usuário logado (ou null)
        meCharacter: async (_: unknown, __: unknown, context: Context) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return await characterService.findByUserId(context.user.id);
        },

        // Retorna atributos do personagem do usuário logado
        meCharacterAttributes: async (_: unknown, __: unknown, context: Context) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            const character = await characterService.findByUserId(context.user.id);

            if (!character) {
                return [];
            }

            return character.attributes || [];
        },

        // Legacy - mantido para compatibilidade initially.
        // TODO: Refactor to usage of findMany when frontend supports multiple characters.
        myCharacters: async (_: unknown, __: unknown, context: Context) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            const character = await characterService.findByUserId(context.user.id);
            return character ? [character] : [];
        },

        character: async (
            _: unknown,
            { id }: { id: string },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return await characterService.findById(id, context.user.id);
        },

        characterAttributes: async (
            _: unknown,
            { characterId }: { characterId: string },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            const character = await characterService.findById(
                characterId,
                context.user.id
            );
            return character?.attributes || [];
        },

        allAttributeDefinitions: async () => {
            const { prisma } = await import('../../prisma/client');
            return await prisma.attributeDefinition.findMany();
        },

        characterInventory: async (
            _: unknown,
            { characterId }: { characterId: string },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            const character = await characterService.findById(
                characterId,
                context.user.id
            );
            return character?.inventory || [];
        },

        characterPowers: async (
            _: unknown,
            { characterId }: { characterId: string },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            const character = await characterService.findById(
                characterId,
                context.user.id
            );
            return character?.powers || [];
        },

        allPowers: async () => {
            const { prisma } = await import('../../prisma/client');
            return await prisma.power.findMany();
        },
    },

    Mutation: {
        createCharacter: async (
            _: unknown,
            { input }: { input: CreateCharacterInput },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            return await characterService.create(context.user.id, input);
        },

        updateCharacter: async (
            _: unknown,
            { input }: { input: UpdateCharacterInput },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            // Busca personagem do usuário
            const character = await characterService.findByUserId(context.user.id);

            if (!character) {
                throw new GraphQLError('Você não possui um personagem', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }

            return await characterService.update(character.id, context.user.id, input);
        },

        deleteCharacter: async (
            _: unknown,
            __: unknown,
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            return await characterService.delete(context.user.id);
        },

        setCurrentHp: async (
            _: unknown,
            { characterId, value }: { characterId: string; value: number },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            return await characterService.setCurrentHp(
                characterId,
                context.user.id,
                value
            );
        },

        restoreHp: async (
            _: unknown,
            { characterId, amount }: { characterId: string; amount: number },
            context: Context
        ) => {
            if (!context.user) {
                throw new GraphQLError('Não autenticado');
            }

            return await characterService.restoreHp(characterId, context.user.id, amount);
        },
    },

    // Field resolvers
    Character: {
        equippedItems: async (parent: any) => {
            return parent.inventory?.filter((slot: any) => slot.isEquipped) || [];
        },
    },

    CharacterAttribute: {
        totalValue: (parent: any) => {
            return parent.baseValue + parent.bonusValue;
        },
    },
};
