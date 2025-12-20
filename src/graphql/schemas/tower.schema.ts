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
        description: String
        x: Int!
        y: Int!
        radius: Int!
        mapLayout: JSON
        activities: [Activity!]!
    }

    type Activity {
        id: ID!
        roomId: ID!
        type: String!
        x: Int!
        y: Int!
        config: JSON
    }

    type TowerFloorRunPayload {
        runId: ID!
        seed: String!
        floor: TowerFloor!
        rooms: [Room!]!
    }

    type EnterRoomResult {
        ok: Boolean!
        room: Room!
        activities: [Activity!]!
    }

    extend type Query {
        towerFloors: [TowerFloor!]!
        floorRooms(floorId: ID!): [Room!]!
        floorBySchoolYear(schoolYear: String!): TowerFloor
    }

    extend type Mutation {
        startTowerFloorRun(floorId: ID!, characterId: ID!): TowerFloorRunPayload!
        enterRoom(runId: ID!, roomId: ID!): EnterRoomResult!
    }
`;
