import { authResolvers } from '../modules/auth/auth.resolvers';
import { adminResolvers } from '../modules/admin/admin.resolvers';
import { playerResolvers } from '../modules/player/player.resolvers';
import { teacherResolvers } from '../modules/teacher/teacher.resolvers';
import { characterResolvers } from '../modules/character/character.resolvers';
import { affinityResolvers } from '../modules/affinity/affinity.resolvers';
import { shopResolvers } from '../modules/shop/shop.resolvers';

export const resolvers = {
    Query: {
        ...authResolvers.Query,
        ...adminResolvers.Query,
        ...playerResolvers.Query,
        ...teacherResolvers.Query,
        ...characterResolvers.Query,
        ...shopResolvers.Query,
        // ...affinityResolvers.Query, 
    },
    Mutation: {
        ...authResolvers.Mutation,
        ...characterResolvers.Mutation,
        ...affinityResolvers.Mutation,
        ...shopResolvers.Mutation,
        ...adminResolvers.Mutation,
    },
    // Field resolvers
    Character: {
        ...characterResolvers.Character,
        ...affinityResolvers.Character,
    },
    CharacterAttribute: characterResolvers.CharacterAttribute,
};
