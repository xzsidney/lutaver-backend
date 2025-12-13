export const shopTypeDefs = `#graphql
  type ShopTransaction {
    id: ID!
    itemId: ID!
    itemName: String
    quantity: Int!
    totalPrice: Int!
    purchasedAt: String!
  }

  type PurchaseResult {
    success: Boolean!
    message: String!
    newBalance: Int
  }
  
  type UseItemResult {
    success: Boolean!
    message: String!
  }

  extend type Query {
    shopItems(type: String, minLevel: Int): [Item!]!
    purchaseHistory: [ShopTransaction!]!
  }

  extend type Mutation {
    buyItem(itemId: ID!, quantity: Int!): PurchaseResult!
    useItem(itemId: ID!): UseItemResult!
  }
`;
