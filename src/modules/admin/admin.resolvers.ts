import { requireAdmin } from '../../utils/authorization';
import { Context } from '../../graphql/context';
import { prisma } from '../../prisma/client';

/**
 * Resolvers exclusivos para Admin
 * Todas as queries/mutations aqui requerem role ADMIN
 */
export const adminResolvers = {
    Query: {
        allUsers: async (_: unknown, __: unknown, context: Context) => {
            requireAdmin(context);
            return await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    isActive: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        },

        allCharacters: async (_: unknown, __: unknown, context: Context) => {
            requireAdmin(context);
            return await prisma.character.findMany({
                include: { user: true },
                orderBy: { updatedAt: 'desc' },
            });
        },

        allDisciplines: async (_: unknown, __: unknown, context: Context) => {
            requireAdmin(context);
            return await prisma.discipline.findMany({
                orderBy: { name: 'asc' }
            });
        },

        allItems: async (_: unknown, __: unknown, context: Context) => {
            requireAdmin(context);
            return await prisma.item.findMany({
                orderBy: { name: 'asc' }
            });
        },

        systemStats: async (_: unknown, __: unknown, context: Context) => {
            requireAdmin(context);
            const totalUsers = await prisma.user.count();
            const playerCount = await prisma.user.count({ where: { role: 'PLAYER' } });
            const teacherCount = await prisma.user.count({ where: { role: 'TEACHER' } });
            const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });

            return { totalUsers, playerCount, teacherCount, adminCount };
        },
    },

    Mutation: {
        updateUser: async (_: unknown, { id, input }: { id: string, input: any }, context: Context) => {
            requireAdmin(context);
            return await prisma.user.update({
                where: { id },
                data: { ...input }
            });
        },

        adminUpdateCharacter: async (_: unknown, { id, input }: { id: string, input: any }, context: Context) => {
            requireAdmin(context);
            return await prisma.character.update({
                where: { id },
                data: { ...input }
            });
        },

        // Discipline Resolvers
        createDiscipline: async (_: unknown, { input }: { input: any }, context: Context) => {
            requireAdmin(context);
            return await prisma.discipline.create({ data: input });
        },

        updateDiscipline: async (_: unknown, { id, input }: { id: string, input: any }, context: Context) => {
            requireAdmin(context);
            return await prisma.discipline.update({
                where: { id },
                data: input
            });
        },

        deleteDiscipline: async (_: unknown, { id }: { id: string }, context: Context) => {
            requireAdmin(context);
            try {
                await prisma.discipline.delete({ where: { id } });
                return true;
            } catch (error) {
                return false;
            }
        },

        // Item Resolvers
        createItem: async (_: unknown, { input }: { input: any }, context: Context) => {
            requireAdmin(context);
            return await prisma.item.create({ data: input });
        },

        updateItem: async (_: unknown, { id, input }: { id: string, input: any }, context: Context) => {
            requireAdmin(context);
            return await prisma.item.update({
                where: { id },
                data: input
            });
        },

        deleteItem: async (_: unknown, { id }: { id: string }, context: Context) => {
            requireAdmin(context);
            try {
                await prisma.item.delete({ where: { id } });
                return true;
            } catch (error) {
                return false;
            }
        },
    }
};
