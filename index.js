const { ApolloServer } = require('apollo-server-express');
const {readFileSync} = require('fs');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({app});

app.get('/', (req, res) => res.end('Welcome to my app'));
app.get('/playground', expressPlayground({endpoint: '/graphql'}));

app
  .listen({port: 4000}, () => {
    console.log(`GraphQL Express Server running on http://localhost:4000${server.graphqlPath}`);
  });
  
