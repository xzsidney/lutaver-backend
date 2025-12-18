export const towerTypeDefs = `
    type TowerFloor {
        id: ID!
        floorNumber: Int!
        name: String!
        schoolYear: String!
        mapWidth: Int!
        mapHeight: Int!
    }

    type Room {
        id: ID!
        floorId: ID!
        type: String!
        name: String!
        x: Int!
        y: Int!
        radius: Int!
    }

    extend type Query {
        towerFloors: [TowerFloor!]!
        floorRooms(floorId: ID!): [Room!]!
    }
`;
