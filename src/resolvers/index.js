const { GraphQLDateTime } = require('graphql-iso-date');
const Installation = require('../database/models/installation')
const Station = require('../database/models/station')
const { combineResolvers } = require('graphql-resolvers');
const { isInstallationOwner, isStationOwner } = require('./middleware')
const { isValidObjectId } = require('../database/util')

module.exports = {
    Date: GraphQLDateTime,
    Query: {
        suitablePlanets: async (_, __, { dataSources }) => {
            try {
                const { results } = await dataSources.ArcsecondAPI.getExoplanets()
                let planets = []
                let installations = await Installation.find()
                results.forEach(({ mass, name }) => {
                    const { value } = mass || {}
                    if (value > 25) {
                        const installation = installations.filter(({ planet }) => planet === name )
                        planets.push({
                            name,
                            mass: value,
                            hasStation: installation.length > 0 ? true : false
                        })
                    }
                });
                if (planets.length > 0) {
                    return planets
                } else {
                    throw new Error('Lista de planetas esta vazia');
                }
            } catch (e) {
                console.log(e)
                throw e
            }
        },
        stations: async () => {
            console.log('chamo')
            try {
                const result = await Station.find()
                if (result.length > 0) {
                    return result
                } else {
                    throw new Error('Lista de Estações esta vazia');
                }
            } catch (e) {
                console.log(e)
                throw e
            }
        },
        stationById: async (_, { id }) => {
            try {
                if (!isValidObjectId(id)) {
                    throw new Error('Id de estação esta inválida');
                }
                const result = await Station.findById(id)
                if (result) {
                    return result
                } else {
                    throw new Error('Estação não encontrada');
                }
            } catch (e) {
                console.log(e)
                throw e
            }
        },
        installations: async () => {
            try {
                const result = await Installation.find()
                if (result.length > 0) {
                    return result
                } else {
                    throw new Error('Lista de Instalações esta vazia');
                }
            } catch (e) {
                console.log(e)
                throw e
            }
        },
        installationById: async (_, { id }) => {
            try {
                if (!isValidObjectId(id)) {
                    throw new Error('Id de Instalação esta inválida');
                }
                const result = await Installation.findById(id)
                if (result) {
                    return result
                } else {
                    throw new Error('Instalação não encontrada');
                }
            } catch (e) {
                console.log(e)
                throw e
            }
        } 
    },
    Mutation: {
        createStation: async (_, { input }) => {
            try {
                if (input.name) {
                    if (input.installationId) {
                        if (!isValidObjectId(input.installationId)) {
                            throw new Error('Id de instalação esta inválida');
                        }
                    }
                    const station = new Station({ 
                        name: input.name || null,
                        installationId: input.installationId || null,
                    });
                    const result = await station.save();
                    const stations = await Station.find()
                    if (result) {
                        return result;
                    } else {
                        throw new Error('Falha ao salvar a estação');
                    }
                } else {
                    throw new Error('Nome da estação é obrigatório');
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        },
        updateStation: combineResolvers(isStationOwner, async (_, { id, input }) => {
            try {
                if (input.installationId) {
                    if (!isValidObjectId(input.installationId)) {
                        throw new Error('Id de instalação esta inválida');
                    }
                }
                const station = await Station.findByIdAndUpdate(id, { ...input }, { new: true });
                if (station) {
                    return station;
                } else {
                    throw new Error('Falha ao fazer as alterações na estação');
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        }),
        deleteStation:  combineResolvers(isStationOwner, async (_, { id }) => {
            try {
                const station = await Station.findByIdAndDelete(id);
                if (station) {
                    await Installation.updateOne({ stationId: id }, { $pull: { stationId: station.id } });
                    return station;
                } else {
                    throw new Error('Falha ao remover a estação');
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        }),
        createInstallation: async (_, { input }) => {
            try {
                if ( input.planet && input.stationId ) {
                    if (!isValidObjectId(input.stationId)) {
                        throw new Error('Id de estação esta inválida');
                    }
                    const installations = await Installation.findOne({ stationId: input.stationId })
                    if (!installations) {
                        throw new Error('Estação ja possui instalação');
                    }
                    const installation = new Installation({ 
                        planet: input.planet || null,
                        stationId: input.stationId || null,
                    });
                    const resultInstallation = await installation.save();
                    if (!resultInstallation) {
                        throw new Error('Falha ao salvar a instalação');
                    }
                    const station = await Station.findById(input.stationId)
                    if (!station) {
                        throw new Error('Estação não encontrada');
                    }
                    station.installationId = resultInstallation.id
                    station.hasInstallation = true
                    const resultStation = await station.save();
                    if (!resultStation) {
                        throw new Error('Falha ao criar o vinculo com a estação');
                    }
                    return resultInstallation
                } else {
                    throw new Error('Nome do planeta e id da estação são obrigatórios');
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        },
        updateInstallation:  combineResolvers(isInstallationOwner, async (_, { id, input }) => {
            try {
                if (input.stationId) {
                    if (!isValidObjectId(input.stationId)) {
                        throw new Error('Id de estação esta inválida');
                    }
                }
                const installation = await Installation.findByIdAndUpdate(id, { ...input }, { new: true });
                if (installation) {
                    return installation    
                } else {
                    throw new Error('Falha ao fazer as alterações na instalação');
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        }),
        deleteInstallation: combineResolvers(isInstallationOwner, async (_, { id }) => {
            try {
              const installation = await Installation.findByIdAndDelete(id);
              if (installation) {
                    await Station.updateOne({ installationId: id }, { $pull: { installationId: installation.id } });
                    return installation;
                } else {
                    throw new Error('Falha ao remover a instalação');
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        }),
    },
    Station:  {
        installation: async ({ installationId }) => {
            try {
                if (installationId) {
                    if (!isValidObjectId(installationId)) {
                        throw new Error('Id de instalação esta inválida');
                    }
                    const result = await Installation.findById(installationId)
                    return result
                } else {
                    throw new Error('Estação não possui instalação');
                }
            } catch (e) {
                console.log(e)
                throw e
            }
        }
    },
    Installation: {
        station: async ({ stationId }) => {
            try {
                if (stationId) {
                    if (!isValidObjectId(stationId)) {
                        throw new Error('Id de estação esta inválida');
                    }
                    const result = await Station.findById(stationId)
                    return result
                } else {
                    throw new Error('Instalação não possui estação');
                }
            } catch (e) {
                console.log(e)
                throw e
            }
        }
    }
}