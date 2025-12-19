
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking Prisma Client for TowerFloorRun...");
    if ('towerFloorRun' in prisma) {
        console.log("SUCCESS: towerFloorRun model found in Prisma Client!");
        // @ts-ignore
        const count = await prisma.towerFloorRun.count();
        console.log(`Current run count: ${count}`);
    } else {
        console.error("FAILURE: towerFloorRun model NOT found in Prisma Client.");
        console.log("Available models:", Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
