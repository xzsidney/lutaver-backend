import { PrismaClient, AttributeCode } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAttributes() {
    console.log('🌱 Seeding AttributeDefinitions...');

    const attributes = [
        {
            code: AttributeCode.STRENGTH,
            name: 'Força',
            description: 'Determina o poder físico e capacidade de causar dano em combate',
            minValue: 1,
            maxValue: 10,
        },
        {
            code: AttributeCode.DEXTERITY,
            name: 'Destreza',
            description: 'Determina agilidade, precisão e capacidade de esquiva',
            minValue: 1,
            maxValue: 10,
        },
        {
            code: AttributeCode.CONSTITUTION,
            name: 'Constituição',
            description: 'Determina resistência, HP máximo e capacidade de recuperação',
            minValue: 1,
            maxValue: 10,
        },
        {
            code: AttributeCode.INTELLIGENCE,
            name: 'Inteligência',
            description: 'Determina poder mágico, raciocínio e eficácia de feitiços',
            minValue: 1,
            maxValue: 10,
        },
        {
            code: AttributeCode.CHARISMA,
            name: 'Carisma',
            description: 'Determina influência social, liderança e capacidade de negociação',
            minValue: 1,
            maxValue: 10,
        },
        {
            code: AttributeCode.LUCK,
            name: 'Sorte',
            description: 'Determina chance de crítico, drop de itens e eventos aleatórios',
            minValue: 1,
            maxValue: 10,
        },
    ];

    for (const attr of attributes) {
        await prisma.attributeDefinition.upsert({
            where: { code: attr.code },
            update: attr,
            create: attr,
        });
    }

    console.log('✅ AttributeDefinitions seeded successfully (6 attributes)!');
}

// Executar se for chamado diretamente
if (require.main === module) {
    seedAttributes()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
