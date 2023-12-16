const express = require("express");
const graphqlYoga = require("graphql-yoga");
const helmet = require("helmet");

module.exports = {
  graphQLServerInstance: (app) => {
    const { createSchema, createYoga } = graphqlYoga;
    const graphQLServer = createYoga({
      schema: createSchema({
        typeDefs: /* GraphQL */ `
          type Query {
            hello: String
          }
        `,
        resolvers: {
          Query: {
            hello: () => "world",
          },
        },
      }),
      logging: false,
    });

    const router = express.Router();

    // Add specific CSP for GraphiQL by using an express router
    router.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            "style-src": ["'self'", "unpkg.com"],
            "script-src": ["'self'", "unpkg.com", "'unsafe-inline'"],
            "img-src": ["'self'", "raw.githubusercontent.com"],
          },
        },
      })
    );

    router.use(graphQLServer);

    // First register the router, to avoid Global CSP configuration to override the specific one
    app.use(graphQLServer.graphqlEndpoint, router);

    // Global CSP configuration
    app.use(helmet());

    // Rest of the routes
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    return graphQLServer.graphqlEndpoint;
  },
};
