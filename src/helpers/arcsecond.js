const { RESTDataSource } = require('apollo-datasource-rest');

class ArcsecondAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.arcsecond.io/';
  }
  async getExoplanets() {
    return this.get(`exoplanets`);
  }
}

module.exports = {
    ArcsecondAPI
}