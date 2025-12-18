import { characterTypeDefs } from './characterSchema';
import { affinityTypeDefs } from '../modules/affinity/affinity.schema';
import { shopTypeDefs } from '../modules/shop/shop.schema';
import { towerTypeDefs } from './schemas/tower.schema';

export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    createdAt: String!
    isActive: Boolean!
  }

  enum UserRole {
    PLAYER
    ADMIN
    TEACHER
  }

  type AuthPayload {
    accessToken: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    role: UserRole
    isActive: Boolean
  }

  # Admin Types
  type SystemStats {
    totalUsers: Int!
    playerCount: Int!
    teacherCount: Int!
    adminCount: Int!
  }

  # Player Types
  type PlayerProfile {
    userId: ID!
    name: String!
    level: Int!
    xp: Int!
    coins: Int!
    characterName: String!
  }

  # Teacher Types
  type Quiz {
    id: ID!
    title: String!
    createdBy: ID!
    questionCount: Int!
    createdAt: String!
  }

  type StudentsStats {
    totalStudents: Int!
    activeStudents: Int!
    averageScore: Float!
  }

  type Query {
    # Auth
    me: User!

    # Admin Only
    allUsers: [User!]!
    allCharacters: [Character!]!
    systemStats: SystemStats!

    # Player Only
    myPlayerProfile: PlayerProfile!

    # Teacher Only
    myQuizzes: [Quiz!]!
    myStudentsStats: StudentsStats!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    adminUpdateCharacter(id: ID!, input: AdminUpdateCharacterInput!): Character!
    refreshToken: AuthPayload!
    logout: Boolean!
    logoutAll: Boolean!
  }

  ${characterTypeDefs}
  ${affinityTypeDefs}
  ${shopTypeDefs}
  ${towerTypeDefs}
`;
