// GraphQL Schema para o sistema de personagens

export const characterTypeDefs = `#graphql
  scalar JSON
  
  # ============================================
  # ENUMS - Character System
  # ============================================
  
  enum SchoolYear {
    FUNDAMENTAL_1_1
    FUNDAMENTAL_1_2
    FUNDAMENTAL_1_3
    FUNDAMENTAL_1_4
    FUNDAMENTAL_1_5
    FUNDAMENTAL_2_6
    FUNDAMENTAL_2_7
    FUNDAMENTAL_2_8
    FUNDAMENTAL_2_9
    HIGH_SCHOOL_1
    HIGH_SCHOOL_2
    HIGH_SCHOOL_3
  }
  
  enum AttributeCode {
    STRENGTH
    DEXTERITY
    CONSTITUTION
    INTELLIGENCE
    CHARISMA
    LUCK
  }
  
  enum ItemType {
    CONSUMABLE
    EQUIPMENT
    MATERIAL
    QUEST
  }

  enum ItemSubType {
    # Consumables
    POTION_HP
    POTION_MANA
    FOOD
    BUFF_ITEM
    
    # Equipment
    WEAPON
    ARMOR_HEAD
    ARMOR_CHEST
    ARMOR_LEGS
    ARMOR_FEET
    ACCESSORY
    
    # Materials
    MINERAL
    HERB
    ESSENCE
    
    # Quest
    QUEST_KEY
    QUEST_LETTER
  }
  
  enum Rarity {
    COMMON
    UNCOMMON
    RARE
    EPIC
    LEGENDARY
    MYTHIC
  }
  
  enum PowerType {
    PASSIVE
    ACTIVE
  }
  
  enum DisciplineType {
    MATHEMATICS
    PORTUGUESE
    HISTORY
    GEOGRAPHY
    SCIENCE
    PHYSICS
    CHEMISTRY
    BIOLOGY
    ENGLISH
    ARTS
    PHYSICAL_EDUCATION
  }
  
  enum EquipmentSlot {
    HEAD
    CHEST
    LEGS
    FEET
    WEAPON
    ACCESSORY_1
    ACCESSORY_2
  }
  
  # ============================================
  # TYPES - Character
  # ============================================
  
  type Character {
    id: ID!
    userId: ID!
    user: User
    name: String!
    schoolYear: SchoolYear!
    level: Int!
    xp: Int!
    coins: Int!
    maxHp: Int!
    currentHp: Int!
    createdAt: String!
    updatedAt: String!
    isActive: Boolean!
    
    # Relações computadas
    attributes: [CharacterAttribute!]!
    powers: [CharacterPower!]!
    inventory: [InventorySlot!]!
    equippedItems: [InventorySlot!]!
  }
  
  type AttributeDefinition {
    id: ID!
    code: AttributeCode!
    name: String!
    description: String!
    minValue: Int!
    maxValue: Int!
  }
  
  type CharacterAttribute {
    id: ID!
    characterId: ID!
    attribute: AttributeDefinition!
    baseValue: Int!
    bonusValue: Int!
    totalValue: Int!
  }
  
  type Power {
    id: ID!
    name: String!
    discipline: DisciplineType!
    type: PowerType!
    rarity: Rarity!
    description: String!
    manaCost: Int
    cooldown: Int
  }
  
  type CharacterPower {
    id: ID!
    characterId: ID!
    power: Power!
    level: Int!
    isEquipped: Boolean!
    slot: Int
    learnedAt: String!
  }
  
  type Item {
    id: ID!
    name: String!
    type: ItemType!
    subType: ItemSubType!
    rarity: Rarity!
    description: String!
    effects: JSON
    stackable: Boolean!
    maxStack: Int!
    price: Int
    isBuyable: Boolean
    requiredLevel: Int
    equipmentSlot: EquipmentSlot
  }
  
  type InventorySlot {
    id: ID!
    characterId: ID!
    item: Item!
    quantity: Int!
    isEquipped: Boolean!
    equippedSlot: EquipmentSlot
    obtainedAt: String!
  }
  
  # ============================================
  # INPUTS
  # ============================================
  
  input CreateCharacterInput {
    name: String!
    schoolYear: SchoolYear!
    attributes: [AttributeAllocationInput!]!
  }

  input AttributeAllocationInput {
    code: AttributeCode!
    points: Int!  # 1-10
  }
  
  input UpdateCharacterInput {
    name: String
    schoolYear: SchoolYear
  }
  
  input UpdateCharacterAttributeInput {
    attributeCode: AttributeCode!
    baseValue: Int!
  }

  input AdminUpdateCharacterInput {
    name: String
    schoolYear: SchoolYear
    isActive: Boolean
  }
  
  input AddItemInput {
    itemId: ID!
    quantity: Int!
  }
  
  # ============================================
  # QUERIES & MUTATIONS
  # ============================================
  
  extend type Query {
    # Character queries
    meCharacter: Character
    meCharacterAttributes: [CharacterAttribute!]!
    
    # Legacy (deprecated - use meCharacter)
    myCharacters: [Character!]!
    character(id: ID!): Character
    
    # Attributes
    characterAttributes(characterId: ID!): [CharacterAttribute!]!
    allAttributeDefinitions: [AttributeDefinition!]!
    
    # Inventory
    characterInventory(characterId: ID!): [InventorySlot!]!
    
    # Powers
    characterPowers(characterId: ID!): [CharacterPower!]!
    allPowers: [Power!]!

    # Admin
    allItems: [Item!]!
  }
  
  extend type Mutation {
    # Character CRUD
    createCharacter(input: CreateCharacterInput!): Character!
    updateCharacter(input: UpdateCharacterInput!): Character!
    deleteCharacter: Boolean!
    
    # HP Management
    setCurrentHp(characterId: ID!, value: Int!): Character!
    restoreHp(characterId: ID!, amount: Int!): Character!
    
    # Attributes
    updateCharacterAttribute(
      characterId: ID!
      input: UpdateCharacterAttributeInput!
    ): CharacterAttribute!
    
    # Inventory
    addItem(characterId: ID!, input: AddItemInput!): InventorySlot!
    removeItem(characterId: ID!, itemId: ID!, quantity: Int!): Boolean!
    equipItem(characterId: ID!, itemId: ID!, slot: EquipmentSlot!): InventorySlot!
    unequipItem(characterId: ID!, itemId: ID!): InventorySlot!
    
    # Powers
    learnPower(characterId: ID!, powerId: ID!): CharacterPower!
    equipPower(characterId: ID!, powerId: ID!, slot: Int!): CharacterPower!
    unequipPower(characterId: ID!, powerId: ID!): CharacterPower!

    # Item CRUD (Admin)
    createItem(input: CreateItemInput!): Item!
    updateItem(id: ID!, input: UpdateItemInput!): Item!
    deleteItem(id: ID!): Boolean!
  }

  input CreateItemInput {
    name: String!
    type: ItemType!
    subType: ItemSubType!
    rarity: Rarity!
    description: String!
    effects: JSON
    stackable: Boolean
    maxStack: Int
    price: Int
    isBuyable: Boolean
    requiredLevel: Int
    equipmentSlot: EquipmentSlot
  }

  input UpdateItemInput {
    name: String
    type: ItemType
    subType: ItemSubType
    rarity: Rarity
    description: String
    effects: JSON
    stackable: Boolean
    maxStack: Int
    price: Int
    isBuyable: Boolean
    requiredLevel: Int
    equipmentSlot: EquipmentSlot
  }
`;
