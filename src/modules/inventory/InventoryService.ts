import { prisma } from '../../prisma/client';
import { GraphQLError } from 'graphql';
import { ItemType, EquipmentSlot } from '@prisma/client';

export class InventoryService {
    async getInventory(characterId: string) {
        return prisma.inventorySlot.findMany({
            where: { characterId },
            include: { item: true }
        });
    }

    async useItem(characterId: string, itemId: string) {
        return prisma.$transaction(async (tx) => {
            // 1. Find slot
            const slot = await tx.inventorySlot.findFirst({
                where: { characterId, itemId },
                include: { item: true }
            });

            if (!slot || slot.quantity < 1) {
                throw new GraphQLError("Item not found in inventory.");
            }

            const item = slot.item;

            // 2. Validate Type
            if (item.type !== ItemType.CONSUMABLE) {
                throw new GraphQLError("This item is not consumable.");
            }

            // 3. Apply Effects
            // Effects are JSON: { "resource_restore": { "hp": 20 }, "stat_bonus": ... }
            const effects = item.effects as any;
            if (!effects) {
                // Consume anyway? Yes.
            } else {
                await this.applyEffects(tx, characterId, effects);
            }

            // 4. Reduce Quantity
            if (slot.quantity === 1) {
                await tx.inventorySlot.delete({ where: { id: slot.id } });
            } else {
                await tx.inventorySlot.update({
                    where: { id: slot.id },
                    data: { quantity: { decrement: 1 } }
                });
            }

            return {
                success: true,
                message: `Used ${item.name}.`,
                item: item
            };
        });
    }

    private async applyEffects(tx: any, characterId: string, effects: any) {
        const character = await tx.character.findUnique({ where: { id: characterId } });
        if (!character) return;

        // Resource Restore
        if (effects.resource_restore) {
            const { hp, mana } = effects.resource_restore;
            if (hp) {
                const newHp = Math.min(character.currentHp + hp, character.maxHp);
                await tx.character.update({
                    where: { id: characterId },
                    data: { currentHp: newHp }
                });
            }
            // Mana not yet on Character model in schema passed? 
            // Checking schema... Item model had 'manaCost' on Power, but Character has levels/xp/hp/coins.
            // If Schema doesn't have Mana, skip it.
        }

        // Add other effects logic here (XP, Coins, etc)
    }

    async equipItem(characterId: string, itemId: string, slotName: EquipmentSlot) {
        return prisma.$transaction(async (tx) => {
            const slot = await tx.inventorySlot.findFirst({
                where: { characterId, itemId },
                include: { item: true }
            });

            if (!slot) throw new GraphQLError("Item not in inventory.");
            if (slot.item.type !== ItemType.EQUIPMENT) throw new GraphQLError("Not an equipment.");
            if (slot.item.equipmentSlot !== slotName) throw new GraphQLError(`Invalid slot. Item requires ${slot.item.equipmentSlot}`);

            // Unequip current item in that slot
            await tx.inventorySlot.updateMany({
                where: { characterId, equippedSlot: slotName, isEquipped: true },
                data: { isEquipped: false, equippedSlot: null }
            });

            // Equip new one
            await tx.inventorySlot.update({
                where: { id: slot.id },
                data: { isEquipped: true, equippedSlot: slotName }
            });

            return slot;
        });
    }
}
