import {
    PrismaClient,
    ItemType,
    ItemSubType,
    Rarity,
    EquipmentSlot,
} from '@prisma/client';

const prisma = new PrismaClient();

export async function seedItems() {
    console.log('🌱 Seeding Items...');

    const items = [
        // Consumíveis
        {
            name: 'Poção de Vida Pequena',
            type: ItemType.CONSUMABLE,
            subType: ItemSubType.POTION_HP,
            rarity: Rarity.COMMON,
            description: 'Restaura 50 pontos de HP',
            stackable: true,
            maxStack: 99,
            effects: { hpRestore: 50 },
        },
        {
            name: 'Poção de Vida Grande',
            type: ItemType.CONSUMABLE,
            subType: ItemSubType.POTION_HP,
            rarity: Rarity.UNCOMMON,
            description: 'Restaura 150 pontos de HP',
            stackable: true,
            maxStack: 99,
            effects: { hpRestore: 150 },
        },
        {
            name: 'Elixir de Conhecimento',
            type: ItemType.CONSUMABLE,
            subType: ItemSubType.BUFF_ITEM,
            rarity: Rarity.RARE,
            description: 'Aumenta Inteligência em 10 por 1 hora',
            stackable: true,
            maxStack: 20,
            effects: { buffIntelligence: 10, duration: 3600 },
        },

        // Equipamentos
        {
            name: 'Espada de Madeira',
            type: ItemType.EQUIPMENT,
            subType: ItemSubType.WEAPON,
            rarity: Rarity.COMMON,
            description: 'Uma espada simples de treinamento',
            stackable: false,
            maxStack: 1,
            requiredLevel: 1,
            equipmentSlot: EquipmentSlot.WEAPON,
            effects: { attackPower: 10, buffStrength: 2 },
        },
        {
            name: 'Espada de Ferro',
            type: ItemType.EQUIPMENT,
            subType: ItemSubType.WEAPON,
            rarity: Rarity.UNCOMMON,
            description: 'Uma espada de ferro bem forjada',
            stackable: false,
            maxStack: 1,
            requiredLevel: 5,
            equipmentSlot: EquipmentSlot.WEAPON,
            effects: { attackPower: 25, buffStrength: 5 },
        },
        {
            name: 'Capacete de Couro',
            type: ItemType.EQUIPMENT,
            subType: ItemSubType.ARMOR_HEAD,
            rarity: Rarity.COMMON,
            description: 'Proteção básica para a cabeça',
            stackable: false,
            maxStack: 1,
            requiredLevel: 1,
            equipmentSlot: EquipmentSlot.HEAD,
            effects: { defense: 5, buffConstitution: 2 },
        },
        {
            name: 'Armadura de Ferro',
            type: ItemType.EQUIPMENT,
            subType: ItemSubType.ARMOR_CHEST,
            rarity: Rarity.RARE,
            description: 'Armadura pesada de ferro',
            stackable: false,
            maxStack: 1,
            requiredLevel: 10,
            equipmentSlot: EquipmentSlot.CHEST,
            effects: { defense: 30, buffConstitution: 8, maxHpBonus: 50 },
        },
        {
            name: 'Anel da Sorte',
            type: ItemType.EQUIPMENT,
            subType: ItemSubType.ACCESSORY,
            rarity: Rarity.EPIC,
            description: 'Um anel mágico que aumenta a sorte',
            stackable: false,
            maxStack: 1,
            requiredLevel: 15,
            equipmentSlot: EquipmentSlot.ACCESSORY_1,
            effects: { buffLuck: 15, critChanceBonus: 10 },
        },

        // Materiais
        {
            name: 'Minério de Ferro',
            type: ItemType.MATERIAL,
            subType: ItemSubType.MINERAL,
            rarity: Rarity.COMMON,
            description: 'Minério usado para forjar equipamentos',
            stackable: true,
            maxStack: 999,
        },
        {
            name: 'Erva Medicinal',
            type: ItemType.MATERIAL,
            subType: ItemSubType.HERB,
            rarity: Rarity.COMMON,
            description: 'Erva usada para criar poções',
            stackable: true,
            maxStack: 999,
        },
    ];

    for (const item of items) {
        await prisma.item.upsert({
            where: { name: item.name },
            update: item,
            create: item,
        });
    }

    console.log('✅ Items seeded successfully!');
}

if (require.main === module) {
    seedItems()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
