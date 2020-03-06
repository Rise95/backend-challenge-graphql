const { skip } = require('graphql-resolvers');
const Installation = require('../../database/models/installation');
const Station = require('../../database/models/station');
const { isValidObjectId } = require('../../database/util');

module.exports.isInstallationOwner = async (_, { id }) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error('Id de instalação esta inválido');
    }
    const installation = await Installation.findById(id);
    if (!installation) {
      throw new Error('Instalação não encontrada');
    } 
    return skip;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports.isStationOwner = async (_, { id }) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error('Id da estação esta inválida');
    }
    const station = await Station.findById(id);
    if (!station) {
      throw new Error('Estação não encontrada');
    } 
    return skip;
  } catch (e) {
    console.log(e);
    throw e;
  }
}