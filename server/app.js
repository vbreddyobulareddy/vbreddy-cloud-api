const express = require("express");
const graphqlYoga = require("graphql-yoga");
const helmet = require("helmet");

const gqlApi = require("./gql-api/index.js");

module.exports = {
  graphQLServerInstance: (app) => {
    const { createYoga } = graphqlYoga;
    const graphQLServer = createYoga({
      schema: gqlApi,
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
