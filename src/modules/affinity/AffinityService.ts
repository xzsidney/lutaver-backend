import { prisma } from '../../prisma/client';
import { DisciplineService } from './DisciplineService';
import { GraphQLError } from 'graphql';

export class AffinityService {
    private disciplineService: DisciplineService;

    constructor() {
        this.disciplineService = new DisciplineService();
    }

    async getCharacterAffinities(characterId: string) {
        // Fetch affinities
        const affinities = await prisma.characterAffinity.findMany({
            where: { characterId },
            include: { discipline: true }
        });

        // Also fetch visible disciplines to ensure we return 0% for those without an affinity record
        const character = await prisma.character.findUnique({ where: { id: characterId } });
        if (!character) throw new Error("Character not found");

        const visibleDisciplines = await this.disciplineService.getVisibleDisciplines(character.schoolYear);

        // Merge: If affinity exists, use it. If not, return virtual 0% affinity for visible discipline.
        return visibleDisciplines.map(discipline => {
            const existing = affinities.find(a => a.disciplineId === discipline.id);
            if (existing) return existing;

            return {
                id: `virtual-${discipline.id}`,
                characterId,
                disciplineId: discipline.id,
                discipline,
                percentage: 0,
                updatedAt: new Date(),
                isVirtual: true // Helper flag
            };
        });
    }

    async increaseAffinity(characterId: string, disciplineId: string, amount: number) {
        if (amount <= 0) return;

        const character = await prisma.character.findUnique({ where: { id: characterId } });
        if (!character) throw new Error("Character not found");

        const discipline = await prisma.discipline.findUnique({ where: { id: disciplineId } });
        if (!discipline) throw new Error("Discipline not found");

        // Validate visibility
        const allVisible = await this.disciplineService.getVisibleDisciplines(character.schoolYear);
        const isVisible = allVisible.some(d => d.id === disciplineId);

        if (!isVisible) {
            throw new GraphQLError("Cannot increase affinity for a discipline that is not yet visible (future school year).", {
                extensions: { code: 'BAD_USER_INPUT' }
            });
        }

        // Get current affinity
        let affinity = await prisma.characterAffinity.findUnique({
            where: {
                characterId_disciplineId: { characterId, disciplineId }
            }
        });

        const currentPercentage = affinity ? affinity.percentage : 0;

        let multiplier = 1.0;
        if (currentPercentage >= 95) multiplier = 0.1;
        else if (currentPercentage >= 80) multiplier = 0.25;
        else if (currentPercentage >= 50) multiplier = 0.5;

        // Use clamped addition
        const effectiveIncrease = Math.max(1, Math.floor(amount * multiplier));

        let newPercentage = currentPercentage + effectiveIncrease;
        if (newPercentage > 100) newPercentage = 100;

        if (affinity) {
            return prisma.characterAffinity.update({
                where: { id: affinity.id },
                data: { percentage: newPercentage }
            });
        } else {
            return prisma.characterAffinity.create({
                data: {
                    characterId,
                    disciplineId,
                    percentage: newPercentage
                }
            });
        }
    }
}
