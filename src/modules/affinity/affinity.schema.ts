export const affinityTypeDefs = `#graphql
  type Discipline {
    id: ID!
    code: String!
    name: String!
    schoolYear: SchoolYear!
    description: String
  }

  type CharacterAffinity {
    id: ID!
    characterId: String!
    disciplineId: String!
    percentage: Int!
    updatedAt: String!
    # Relations
    discipline: Discipline!
    # Virtual helper, not in DB
    isVirtual: Boolean
  }

  extend type Character {
    affinities: [CharacterAffinity!]!
  }

  input CreateDisciplineInput {
    code: String!
    name: String!
    schoolYear: SchoolYear!
    description: String
  }

  input UpdateDisciplineInput {
    code: String
    name: String
    schoolYear: SchoolYear
    description: String
  }

  extend type Query {
    allDisciplines: [Discipline!]!
  }

  extend type Mutation {
    increaseAffinity(characterId: ID!, disciplineId: ID!, amount: Int!): CharacterAffinity!
    
    # Discipline CRUD (Admin)
    createDiscipline(input: CreateDisciplineInput!): Discipline!
    updateDiscipline(id: ID!, input: UpdateDisciplineInput!): Discipline!
    deleteDiscipline(id: ID!): Boolean!
  }
`;
