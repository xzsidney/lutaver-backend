// Script principal de seed - executa todos os seeds
import { seedAttributes } from './attributes';
import { seedPowers } from './powers';
import { seedItems } from './items';

async function main() {
    console.log('🌱 Starting database seeding...\n');

    await seedAttributes();
    console.log('');

    await seedPowers();
    console.log('');

    await seedItems();
    console.log('');

    console.log('✅ Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../src/prisma/client');
        await prisma.$disconnect();
    });
