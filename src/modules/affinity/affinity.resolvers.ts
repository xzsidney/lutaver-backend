import { AffinityService } from './AffinityService';

const affinityService = new AffinityService();

export const affinityResolvers = {
    Character: {
        affinities: async (parent: any) => {
            return affinityService.getCharacterAffinities(parent.id);
        }
    },
    Mutation: {
        increaseAffinity: async (_: any, { characterId, disciplineId, amount }: { characterId: string, disciplineId: string, amount: number }) => {
            return affinityService.increaseAffinity(characterId, disciplineId, amount);
        }
    }
};
