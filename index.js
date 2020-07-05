const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const mongoURI = require('./config');

const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(mongoURI.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
