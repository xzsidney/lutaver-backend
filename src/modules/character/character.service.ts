import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma/client';
import type {
    CreateCharacterInput,
    UpdateCharacterInput,
} from './character.types';
import {
    validateCharacterOwnership,
    validateHp,
    validateCharacterLimit,
    validateAttributePointsDistribution,
} from './character.validators';

class CharacterService {
    /**
     * Criar novo personagem
     * Validações: 1 por usuário + 15 pontos distribuídos
     */
    async create(userId: string, input: CreateCharacterInput) {
        // 1. Validar limite de personagens
        await validateCharacterLimit(userId);

        // 2. Validar distribuição de pontos (15 total, 6 atributos)
        validateAttributePointsDistribution(input.attributes);

        // 3. Criar personagem + atributos em transação
        return await prisma.$transaction(async (tx) => {
            // 3.1 Criar personagem
            const character = await tx.character.create({
                data: {
                    userId,
                    name: input.name,
                    schoolYear: input.schoolYear as any,
                },
            });

            // 3.2 Buscar AttributeDefinitions
            const attributeDefs = await tx.attributeDefinition.findMany({
                where: {
                    code: {
                        in: input.attributes.map((a) => a.code as any),
                    },
                },
            });

            // 3.3 Criar CharacterAttributes
            for (const attrInput of input.attributes) {
                const attrDef = attributeDefs.find((d) => d.code === attrInput.code);
                if (!attrDef) {
                    throw new GraphQLError(`Atributo ${attrInput.code} não encontrado`);
                }

                await tx.characterAttribute.create({
                    data: {
                        characterId: character.id,
                        attributeId: attrDef.id,
                        baseValue: attrInput.points,
                        bonusValue: 0,
                    },
                });
            }

            // 3.4 Retornar personagem com atributos
            return await tx.character.findUnique({
                where: { id: character.id },
                include: {
                    attributes: {
                        include: {
                            attribute: true,
                        },
                    },
                    powers: {
                        include: {
                            power: true,
                        },
                    },
                    inventory: {
                        include: {
                            item: true,
                        },
                    },
                },
            });
        });
    }

    /**
     * Buscar personagem do usuário (único)
     */
    async findByUserId(userId: string) {
        return await prisma.character.findFirst({
            where: { userId },
            include: {
                attributes: {
                    include: {
                        attribute: true,
                    },
                },
                powers: {
                    include: {
                        power: true,
                    },
                },
                inventory: {
                    include: {
                        item: true,
                    },
                },
            },
        });
    }

    /**
     * Buscar personagem por ID
     * Valida propriedade
     */
    async findById(characterId: string, userId: string) {
        await validateCharacterOwnership(characterId, userId);

        return await prisma.character.findUnique({
            where: { id: characterId },
            include: {
                attributes: {
                    include: {
                        attribute: true,
                    },
                },
                powers: {
                    include: {
                        power: true,
                    },
                },
                inventory: {
                    include: {
                        item: true,
                    },
                },
            },
        });
    }

    /**
     * Atualizar personagem (apenas name e schoolYear)
     */
    async update(
        characterId: string,
        userId: string,
        input: UpdateCharacterInput
    ) {
        await validateCharacterOwnership(characterId, userId);

        return await prisma.character.update({
            where: { id: characterId },
            data: {
                ...(input.name && { name: input.name }),
                ...(input.schoolYear && { schoolYear: input.schoolYear as any }),
            },
            include: {
                attributes: {
                    include: {
                        attribute: true,
                    },
                },
                powers: {
                    include: {
                        power: true,
                    },
                },
                inventory: {
                    include: {
                        item: true,
                    },
                },
            },
        });
    }

    /**
     * Deletar personagem do usuário
     */
    async delete(userId: string): Promise<boolean> {
        const character = await prisma.character.findFirst({
            where: { userId },
        });

        if (!character) {
            throw new GraphQLError('Você não possui um personagem', {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        await prisma.character.delete({
            where: { id: character.id },
        });

        return true;
    }

    /**
     * Definir HP atual
     * Valida que não exceda maxHp
     */
    async setCurrentHp(characterId: string, userId: string, value: number) {
        await validateCharacterOwnership(characterId, userId);

        const character = await prisma.character.findUnique({
            where: { id: characterId },
            select: { maxHp: true },
        });

        if (!character) {
            throw new GraphQLError('Personagem não encontrado');
        }

        validateHp(value, character.maxHp);

        return await prisma.character.update({
            where: { id: characterId },
            data: { currentHp: value },
            include: {
                attributes: {
                    include: {
                        attribute: true,
                    },
                },
                powers: {
                    include: {
                        power: true,
                    },
                },
                inventory: {
                    include: {
                        item: true,
                    },
                },
            },
        });
    }

    /**
     * Restaurar HP (adicionar ao currentHp)
     * Não pode ultrapassar maxHp
     */
    async restoreHp(characterId: string, userId: string, amount: number) {
        await validateCharacterOwnership(characterId, userId);

        const character = await prisma.character.findUnique({
            where: { id: characterId },
            select: { currentHp: true, maxHp: true },
        });

        if (!character) {
            throw new GraphQLError('Personagem não encontrado');
        }

        const newHp = Math.min(character.currentHp + amount, character.maxHp);

        return await prisma.character.update({
            where: { id: characterId },
            data: { currentHp: newHp },
            include: {
                attributes: {
                    include: {
                        attribute: true,
                    },
                },
                powers: {
                    include: {
                        power: true,
                    },
                },
                inventory: {
                    include: {
                        item: true,
                    },
                },
            },
        });
    }
}

export const characterService = new CharacterService();
