const { makeExecutableSchema } = require("@graphql-tools/schema");
const votesAPI = require("./api.js");

module.exports = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type Votes {
      id: Int!
      timeCast: String!
      candidate: String!
    }

    type Query {
      votes: [Votes!]!
    }
  `,
  resolvers: {
    Query: {
      votes() {
        console.log("---=Context ", votesAPI);
        return votesAPI.getAllVotes();
      },
    },
  },
});
