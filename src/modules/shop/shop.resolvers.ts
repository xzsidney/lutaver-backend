import { ShopService } from './ShopService';
import { InventoryService } from '../inventory/InventoryService';
import { prisma } from '../../prisma/client';
import { GraphQLError } from 'graphql';

const shopService = new ShopService();
const inventoryService = new InventoryService();

const getCharacter = async (userId: string) => {
    const character = await prisma.character.findUnique({ where: { userId } });
    if (!character) throw new GraphQLError("Character not found for this user.");
    return character;
};

export const shopResolvers = {
    Query: {
        shopItems: async (_: any, args: any) => {
            return shopService.getShopItems(args);
        },
        purchaseHistory: async (_: any, __: any, context: any) => {
            if (!context.user) throw new GraphQLError("Unauthorized");
            const character = await getCharacter(context.user.id);
            return shopService.getPurchaseHistory(character.id);
        }
    },
    Mutation: {
        buyItem: async (_: any, { itemId, quantity }: any, context: any) => {
            if (!context.user) throw new GraphQLError("Unauthorized");
            const character = await getCharacter(context.user.id);
            return shopService.buyItem(character.id, itemId, quantity);
        },
        useItem: async (_: any, { itemId }: any, context: any) => {
            if (!context.user) throw new GraphQLError("Unauthorized");
            const character = await getCharacter(context.user.id);
            return inventoryService.useItem(character.id, itemId);
        },
        equipItem: async (_: any, { characterId, itemId, slot }: any, context: any) => {
            if (!context.user) throw new GraphQLError("Unauthorized");

            // Security check: ensure character belongs to user
            const character = await getCharacter(context.user.id);

            if (character.id !== characterId) {
                // Assuming getCharacter(context.user.id) returns the ONE character of the user.
                throw new GraphQLError("Unauthorized character access");
            }

            return inventoryService.equipItem(characterId, itemId, slot);
        },
        unequipItem: async (_: any, { characterId, itemId }: any, context: any) => {
            throw new GraphQLError("Not implemented yet");
        }
    }
};
