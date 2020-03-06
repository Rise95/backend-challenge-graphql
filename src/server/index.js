const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const { buildFederatedSchema } = require("@apollo/federation");
const resolvers = require('../resolvers');
const typeDefs = require('../typeDefs');
const { ArcsecondAPI } = require('../helpers/arcsecond')
const app = express();

app.use(cors());
app.use(express.json());


const apolloServer = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    }
  ]),
  dataSources: () => {
    return {
      ArcsecondAPI: new ArcsecondAPI()
    };
  },
  formatError: (error) => {
    return {
      message: error.message
    };
  }
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;

app.use('/', (req, res, next) => {
  res.send({ message: 'Hello' });
})

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);