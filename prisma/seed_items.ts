import { PrismaClient, ItemType, ItemSubType, Rarity, EquipmentSlot } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Items...');

    // 1. Health Potion
    await prisma.item.upsert({
        where: { name: 'Poção de Vida Menor' },
        update: {},
        create: {
            name: 'Poção de Vida Menor',
            type: ItemType.CONSUMABLE,
            subType: ItemSubType.POTION_HP,
            rarity: Rarity.COMMON,
            description: 'Restaura 20 pontos de vida.',
            price: 10,
            isBuyable: true,
            stackable: true,
            maxStack: 99,
            effects: {
                resource_restore: { hp: 20 }
            }
        }
    });

    // 2. Mana Potion
    await prisma.item.upsert({
        where: { name: 'Poção de Mana Menor' },
        update: {},
        create: {
            name: 'Poção de Mana Menor',
            type: ItemType.CONSUMABLE,
            subType: ItemSubType.POTION_MANA,
            rarity: Rarity.COMMON,
            description: 'Restaura 10 pontos de mana.',
            price: 15,
            isBuyable: true,
            stackable: true,
            maxStack: 99,
            effects: {
                resource_restore: { mana: 10 }
            }
        }
    });

    // 3. Wooden Sword (Beginner Weapon)
    await prisma.item.upsert({
        where: { name: 'Espada de Madeira' },
        update: {},
        create: {
            name: 'Espada de Madeira',
            type: ItemType.EQUIPMENT,
            subType: ItemSubType.WEAPON,
            rarity: Rarity.COMMON,
            description: 'Uma espada simples para treino.',
            price: 50,
            isBuyable: true,
            stackable: false,
            equipmentSlot: EquipmentSlot.WEAPON,
            effects: {
                stat_bonus: { STRENGTH: 2 }
            }
        }
    });

    // 4. Cap (Head Armor)
    await prisma.item.upsert({
        where: { name: 'Boné Escolar' },
        update: {},
        create: {
            name: 'Boné Escolar',
            type: ItemType.EQUIPMENT,
            subType: ItemSubType.ARMOR_HEAD,
            rarity: Rarity.COMMON,
            description: 'Protege do sol e dá estilo.',
            price: 30,
            isBuyable: true,
            stackable: false,
            equipmentSlot: EquipmentSlot.HEAD,
            effects: {
                stat_bonus: { CHARISMA: 1 }
            }
        }
    });

    // 5. XP Scroll (Rare)
    await prisma.item.upsert({
        where: { name: 'Pergaminho de Conhecimento' },
        update: {},
        create: {
            name: 'Pergaminho de Conhecimento',
            type: ItemType.CONSUMABLE,
            subType: ItemSubType.BUFF_ITEM,
            rarity: Rarity.RARE,
            description: 'Concede 100 XP instantaneamente.',
            price: 500,
            isBuyable: true, // Expensive
            stackable: true,
            effects: {
                xp_gain: 100
            }
        }
    });

    console.log('Items seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
