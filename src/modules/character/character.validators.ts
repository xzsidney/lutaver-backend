import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma/client';

const REQUIRED_TOTAL_POINTS = 16; // 1 base em cada atributo (6) + 10 distribuíveis
const REQUIRED_ATTRIBUTE_CODES = ['STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'CHARISMA', 'LUCK'];
import { GameConfig } from '../../config/game.config';

/**
 * Validar se o usuário é dono do personagem
 * Lança erro FORBIDDEN se não for
 */
export async function validateCharacterOwnership(
    characterId: string,
    userId: string
): Promise<void> {
    const character = await prisma.character.findUnique({
        where: { id: characterId },
        select: { userId: true },
    });

    if (!character) {
        throw new GraphQLError('Personagem não encontrado', {
            extensions: { code: 'NOT_FOUND' },
        });
    }

    if (character.userId !== userId) {
        throw new GraphQLError(
            'Você não tem permissão para acessar este personagem',
            {
                extensions: { code: 'FORBIDDEN' },
            }
        );
    }
}

/**
 * Validar HP (não pode ser negativo nem exceder maxHp)
 */
export function validateHp(currentHp: number, maxHp: number): void {
    if (currentHp < 0) {
        throw new GraphQLError('HP não pode ser negativo');
    }
    if (currentHp > maxHp) {
        throw new GraphQLError('HP atual não pode ultrapassar HP máximo');
    }
}

/**
 * Validar valor de atributo (deve estar entre min e max)
 */
export async function validateAttributeValue(
    attributeCode: string,
    value: number
): Promise<void> {
    const attributeDef = await prisma.attributeDefinition.findUnique({
        where: { code: attributeCode as any },
    });

    if (!attributeDef) {
        throw new GraphQLError('Atributo não encontrado');
    }

    if (value < attributeDef.minValue || value > attributeDef.maxValue) {
        throw new GraphQLError(
            `Valor do atributo ${attributeDef.name} deve estar entre ${attributeDef.minValue} e ${attributeDef.maxValue}`
        );
    }
}

/**
 * Validar limite de personagens por usuário
 * Lança CHARACTER_LIMIT_REACHED se atingir o limite configurado
 */
export async function validateCharacterLimit(userId: string): Promise<void> {
    const count = await prisma.character.count({
        where: { userId },
    });

    if (count >= GameConfig.maxCharactersPerUser) {
        throw new GraphQLError(
            `Você já atingiu o limite de ${GameConfig.maxCharactersPerUser} personagem(ns)`,
            {
                extensions: { code: 'CHARACTER_LIMIT_REACHED' },
            }
        );
    }
}

/**
 * Validar distribuição de 15 pontos
 */
export function validateAttributePointsDistribution(
    attributes: Array<{ code: string; points: number }>
): void {
    // 1. Validar soma total = 15
    const totalPoints = attributes.reduce((sum, attr) => sum + attr.points, 0);

    if (totalPoints !== REQUIRED_TOTAL_POINTS) {
        throw new GraphQLError(
            `Total de pontos deve ser exatamente ${REQUIRED_TOTAL_POINTS}. Recebido: ${totalPoints}`,
            { extensions: { code: 'INVALID_ATTRIBUTE_POINTS_TOTAL' } }
        );
    }

    // 2. Validar que todos os 6 atributos foram fornecidos
    const providedCodes = attributes.map((a) => a.code);
    const missing = REQUIRED_ATTRIBUTE_CODES.filter(
        (code) => !providedCodes.includes(code)
    );

    if (missing.length > 0) {
        throw new GraphQLError(
            `Atributos faltando: ${missing.join(', ')}`,
            { extensions: { code: 'MISSING_ATTRIBUTES' } }
        );
    }

    // 3. Validar duplicatas
    const duplicates = providedCodes.filter(
        (code, index) => providedCodes.indexOf(code) !== index
    );

    if (duplicates.length > 0) {
        throw new GraphQLError(
            `Atributos duplicados: ${duplicates.join(', ')}`,
            { extensions: { code: 'DUPLICATE_ATTRIBUTES' } }
        );
    }

    // 4. Validar limites individuais (1-10)
    for (const attr of attributes) {
        if (attr.points < 1 || attr.points > 10) {
            throw new GraphQLError(
                `Pontos do atributo ${attr.code} devem estar entre 1 e 10. Recebido: ${attr.points}`,
                { extensions: { code: 'INVALID_ATTRIBUTE_VALUE' } }
            );
        }
    }
}
