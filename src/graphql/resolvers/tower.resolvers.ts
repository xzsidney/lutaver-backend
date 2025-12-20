import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DEBUG: Verify this file is being loaded
console.log('🔍 [TOWER RESOLVERS] File loaded at:', new Date().toISOString());

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
        floorBySchoolYear: async (_: any, { schoolYear }: { schoolYear: string }) => {
            console.log('🔍 [QUERY] floorBySchoolYear called with:', schoolYear);
            const floor = await prisma.towerFloor.findFirst({
                where: {
                    schoolYear: schoolYear as any
                }
            });
            console.log('✅ [QUERY] floorBySchoolYear result:', floor);
            return floor;
        },
    },
    Mutation: {
        startTowerFloorRun: async (_: any, { floorId, characterId }: { floorId: string, characterId: string }) => {
            console.log('🎯 [MUTATION CALLED] startTowerFloorRun invoked!', { floorId, characterId });
            try {
                // Debug logs
                console.log(`[startTowerFloorRun] Starting for floor ${floorId}, char ${characterId}`);

                // 1. Generate FIXED Deterministic Seed per floor
                // Same floorId = Same seed = Same map layout
                const seed = `floor_${floorId}_layout`;

                // Check prisma model
                if (!prisma.towerFloorRun) {
                    console.error("[startTowerFloorRun] CRITICAL: prisma.towerFloorRun is undefined!");
                    throw new Error("Internal Server Error: Database model missing");
                }

                // 2. Create Run
                const run = await prisma.towerFloorRun.create({
                    data: {
                        floorId,
                        characterId,
                        seed,
                        status: 'ACTIVE'
                    },
                    include: {
                        floor: true
                    }
                });

                console.log(`[startTowerFloorRun] Created run: ${run.id}`);

                // 3. Fetch Rooms
                const rooms = await prisma.room.findMany({
                    where: { floorId }
                });

                return {
                    runId: run.id,
                    seed: run.seed,
                    floor: run.floor,
                    rooms
                };
            } catch (error) {
                console.error("[startTowerFloorRun] ERROR:", error);
                throw error;
            }
        },
        enterRoom: async (_: any, { runId, roomId }: { runId: string, roomId: string }) => {
            // 1. Validate Run exists
            const run = await prisma.towerFloorRun.findUnique({
                where: { id: runId }
            });
            if (!run) throw new Error("Run not found");

            // 2. Validate Room belongs to Floor
            const room = await prisma.room.findUnique({
                where: { id: roomId },
                include: { activities: true }
            });

            if (!room) throw new Error("Room not found");
            if (room.floorId !== run.floorId) throw new Error("Room does not belong to this floor configuration");

            return {
                ok: true,
                room,
                activities: room.activities
            };
        }
    }
};
