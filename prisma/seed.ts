import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing tower data...');
    await prisma.room.deleteMany({});
    await prisma.towerFloor.deleteMany({});

    // Create Tower Floors
    console.log('🏢 Creating tower floors...');

    const floor1 = await prisma.towerFloor.create({
        data: {
            floorNumber: 1,
            name: 'Primeiro Andar - 1º Ano',
            schoolYear: 'FUNDAMENTAL_1_1',
            mapWidth: 800,
            mapHeight: 600,
        },
    });

    const floor2 = await prisma.towerFloor.create({
        data: {
            floorNumber: 2,
            name: 'Segundo Andar - 2º Ano',
            schoolYear: 'FUNDAMENTAL_1_2',
            mapWidth: 800,
            mapHeight: 600,
        },
    });

    const floor3 = await prisma.towerFloor.create({
        data: {
            floorNumber: 3,
            name: 'Terceiro Andar - 3º Ano',
            schoolYear: 'FUNDAMENTAL_1_3',
            mapWidth: 800,
            mapHeight: 600,
        },
    });

    console.log(`✅ Created ${3} tower floors`);

    // Create Rooms for Floor 1
    console.log('🚪 Creating rooms for Floor 1...');

    const floor1Rooms = await Promise.all([
        prisma.room.create({
            data: {
                floorId: floor1.id,
                type: 'CLASSROOM',
                name: 'Sala de Matemática',
                x: 150,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor1.id,
                type: 'CLASSROOM',
                name: 'Sala de Português',
                x: 400,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor1.id,
                type: 'CLASSROOM',
                name: 'Sala de Ciências',
                x: 650,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor1.id,
                type: 'CAFETERIA',
                name: 'Cantina',
                x: 150,
                y: 450,
                radius: 50,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor1.id,
                type: 'LIBRARY',
                name: 'Biblioteca',
                x: 400,
                y: 450,
                radius: 50,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor1.id,
                type: 'INFIRMARY',
                name: 'Enfermaria',
                x: 650,
                y: 450,
                radius: 40,
            },
        }),
    ]);

    console.log(`✅ Created ${floor1Rooms.length} rooms for Floor 1`);

    // Create Rooms for Floor 2
    console.log('🚪 Creating rooms for Floor 2...');

    const floor2Rooms = await Promise.all([
        prisma.room.create({
            data: {
                floorId: floor2.id,
                type: 'CLASSROOM',
                name: 'Sala de História',
                x: 150,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor2.id,
                type: 'CLASSROOM',
                name: 'Sala de Geografia',
                x: 400,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor2.id,
                type: 'CLASSROOM',
                name: 'Sala de Inglês',
                x: 650,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor2.id,
                type: 'COURTYARD',
                name: 'Pátio',
                x: 400,
                y: 450,
                radius: 70,
            },
        }),
    ]);

    console.log(`✅ Created ${floor2Rooms.length} rooms for Floor 2`);

    // Create Rooms for Floor 3
    console.log('🚪 Creating rooms for Floor 3...');

    const floor3Rooms = await Promise.all([
        prisma.room.create({
            data: {
                floorId: floor3.id,
                type: 'CLASSROOM',
                name: 'Sala de Artes',
                x: 150,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor3.id,
                type: 'CLASSROOM',
                name: 'Sala de Ed. Física',
                x: 400,
                y: 150,
                radius: 60,
            },
        }),
        prisma.room.create({
            data: {
                floorId: floor3.id,
                type: 'BOSS_ROOM',
                name: 'Sala do Diretor',
                x: 400,
                y: 450,
                radius: 80,
            },
        }),
    ]);

    console.log(`✅ Created ${floor3Rooms.length} rooms for Floor 3`);

    console.log('');
    console.log('🎉 Seed completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${3} Tower Floors`);
    console.log(`   - ${floor1Rooms.length + floor2Rooms.length + floor3Rooms.length} Rooms`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
