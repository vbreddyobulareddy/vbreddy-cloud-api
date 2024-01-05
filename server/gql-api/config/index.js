const { makeExecutableSchema } = require("@graphql-tools/schema");
const configDao = require("./dao.js");

module.exports = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type Config {
      id: Int!
      name: String!
      desc: String!
      value: String!
      isJsonVal: Boolean
      isActive: Boolean
    }

    type Query {
      getConfigById(configId: Int!): [Config!]!
    }

    type Mutation {
      setConfig(payload: Config!): Config!
    }
  `,
  resolvers: {
    Query: {
      getConfigById() {
        return configDao.getConfigById();
      },
    },
    Mutation: {
      setConfig(_, payload) {
        return configDao.setConfig(payload);
      },
    },
  },
});
