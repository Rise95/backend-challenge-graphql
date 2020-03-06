const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar Date
  
    type Query {
        suitablePlanets: [Planet]
        stations: [Station!]
        stationById(id: ID!): Station
        installations: [Installation!]
        installationById(id: ID!): Installation
    }

    type Mutation {
        createStation(input: createStationInput!): Station
        updateStation(id: ID!, input: updateStationInput!): Station
        deleteStation(id: ID!): Station
        createInstallation(input: createInstallationInput!): Installation
        updateInstallation(id: ID!, input: updateInstallationInput!): Installation
        deleteInstallation(id: ID!): Installation
    }

    input createStationInput {
        name: String
        installationId: String
    }

    input updateStationInput {
        name: String
        installationId: String
    }

    input createInstallationInput {
        planet: String
        stationId: String
    }

    input updateInstallationInput {
        planet: String
        stationId: String
    }

    type Planet {
        name: String!
        mass: String!
        hasStation: Boolean!
    }

    type Station {
        id: ID!
        name: String!
        installation: Installation!
        hasInstallation: Boolean!
        createdAt: Date!
        updatedAt: Date!
    }

    type Installation {
        id: ID!
        planet: String!
        station: Station!
        createdAt: Date!
        updatedAt: Date!
    }

`;