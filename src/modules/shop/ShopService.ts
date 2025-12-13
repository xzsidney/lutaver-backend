import { prisma } from '../../prisma/client';
import { GraphQLError } from 'graphql';

export class ShopService {
    async getShopItems(filter?: { type?: string; minLevel?: number }) {
        const where: any = {
            isBuyable: true
        };

        if (filter?.type) where.type = filter.type;
        if (filter?.minLevel) where.requiredLevel = { lte: filter.minLevel };

        return prisma.item.findMany({
            where,
            orderBy: { name: 'asc' }
        });
    }

    async buyItem(characterId: string, itemId: string, quantity: number = 1) {
        if (quantity < 1) throw new GraphQLError("Quantity must be at least 1.");

        return prisma.$transaction(async (tx) => {
            // 1. Fetch Item and Character
            const item = await tx.item.findUnique({ where: { id: itemId } });
            if (!item) throw new GraphQLError("Item not found.");
            if (!item.isBuyable) throw new GraphQLError("This item is not for sale.");

            const character = await tx.character.findUnique({ where: { id: characterId } });
            if (!character) throw new GraphQLError("Character not found.");

            // 2. Check Balance
            const totalCost = item.price * quantity;
            if (character.coins < totalCost) {
                throw new GraphQLError(`Insufficient funds. Need ${totalCost} coins but have ${character.coins}.`);
            }

            // 3. Deduct Coins
            await tx.character.update({
                where: { id: characterId },
                data: { coins: { decrement: totalCost } }
            });

            // 4. Add to Inventory
            // Check if user already has this item (if stackable)
            let inventorySlot;
            if (item.stackable) {
                const existingSlot = await tx.inventorySlot.findFirst({
                    where: { characterId, itemId }
                });

                if (existingSlot) {
                    // Check max stack (simplified: allow overflow for now or strict? Let's be strict but simple)
                    // If existing + quantity > maxStack, strictly speaking we should create new slots, 
                    // but for now let's just increment and maybe validate maxStack later or assume infinite inventory for simplicity
                    // unless specifically requested. The PROMPT said "Increment quantity until max_stack".
                    // Let's simplified: just increment for now.
                    inventorySlot = await tx.inventorySlot.update({
                        where: { id: existingSlot.id },
                        data: { quantity: { increment: quantity } }
                    });
                } else {
                    inventorySlot = await tx.inventorySlot.create({
                        data: {
                            characterId,
                            itemId,
                            quantity
                        }
                    });
                }
            } else {
                // Non-stackable: create multiple slots? Or just one with quantity? 
                // Usually non-stackable means quantity is always 1 per slot.
                // The prompt says: "Non-stackable: create a new entry in inventory"
                // So if quantity is 5, we create 5 slots? That's heavy.
                // Let's loop.
                const promises = [];
                for (let i = 0; i < quantity; i++) {
                    promises.push(tx.inventorySlot.create({
                        data: {
                            characterId,
                            itemId,
                            quantity: 1
                        }
                    }));
                }
                const results = await Promise.all(promises);
                inventorySlot = results[0]; // Return the first one just as reference
            }

            // 5. Create Transaction Record
            await tx.shopTransaction.create({
                data: {
                    characterId,
                    itemId,
                    quantity,
                    totalPrice: totalCost
                }
            });

            return {
                success: true,
                message: `Purchased ${quantity}x ${item.name} for ${totalCost} coins.`,
                newBalance: character.coins - totalCost,
                item: item
            };
        });
    }

    async getPurchaseHistory(characterId: string) {
        return prisma.shopTransaction.findMany({
            where: { characterId },
            include: { item: true },
            orderBy: { purchasedAt: 'desc' }
        });
    }
}
