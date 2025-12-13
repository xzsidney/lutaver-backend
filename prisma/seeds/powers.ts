import { PrismaClient, Discipline, PowerType, Rarity } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPowers() {
    console.log('🌱 Seeding Powers...');

    const powers = [
        {
            name: 'Raio de Fogo',
            discipline: Discipline.MATHEMATICS,
            type: PowerType.ACTIVE,
            rarity: Rarity.COMMON,
            description: 'Lança um raio de fogo que causa dano baseado em Inteligência',
            manaCost: 20,
            cooldown: 5,
            effects: { damage: 30, scalingWith: 'INTELLIGENCE' },
        },
        {
            name: 'Escudo Arcano',
            discipline: Discipline.MATHEMATICS,
            type: PowerType.ACTIVE,
            rarity: Rarity.UNCOMMON,
            description: 'Cria um escudo mágico que absorve dano',
            manaCost: 30,
            cooldown: 10,
            effects: { shield: 50, duration: 10 },
        },
        {
            name: 'Poder da Palavra',
            discipline: Discipline.PORTUGUESE,
            type: PowerType.PASSIVE,
            rarity: Rarity.COMMON,
            description: 'Aumenta o Carisma permanentemente',
            effects: { buffCharisma: 5 },
        },
        {
            name: 'Análise Química',
            discipline: Discipline.CHEMISTRY,
            type: PowerType.ACTIVE,
            rarity: Rarity.RARE,
            description: 'Identifica pontos fracos do inimigo',
            manaCost: 25,
            cooldown: 8,
            effects: { debuffDefense: 20, duration: 15 },
        },
        {
            name: 'Velocidade da Luz',
            discipline: Discipline.PHYSICS,
            type: PowerType.ACTIVE,
            rarity: Rarity.EPIC,
            description: 'Aumenta drasticamente a Destreza temporariamente',
            manaCost: 40,
            cooldown: 20,
            effects: { buffDexterity: 30, duration: 10 },
        },
    ];

    for (const power of powers) {
        await prisma.power.upsert({
            where: { name: power.name },
            update: power,
            create: power,
        });
    }

    console.log('✅ Powers seeded successfully!');
}

if (require.main === module) {
    seedPowers()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
