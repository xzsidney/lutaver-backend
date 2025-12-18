import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const towerResolvers = {
    Query: {
        towerFloors: async () => {
            const floors = await prisma.towerFloor.findMany({
                orderBy: {
                    floorNumber: 'asc'
                }
            });
            return floors;
        },
        floorRooms: async (_: any, { floorId }: { floorId: string }) => {
            const rooms = await prisma.room.findMany({
                where: {
                    floorId: floorId
                },
                include: {
                    activities: true
                }
            });
            return rooms;
        },
    },
};
