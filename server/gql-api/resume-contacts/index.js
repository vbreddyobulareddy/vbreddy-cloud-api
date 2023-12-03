const { makeExecutableSchema } = require("@graphql-tools/schema");
const resumeContactsApi = require("./api.js");

module.exports = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type ResumeContacts {
      id: Int!
      email: String!
      status: String!
      type: String
    }

    type Query {
      fetchAllResumeContacts: [ResumeContacts!]!
    }

    type Mutation {
      sendResume(email: String!): ResumeContacts!
    }
  `,
  resolvers: {
    Query: {
      fetchAllResumeContacts() {
        return resumeContactsApi.fetchAllResumeContacts();
      },
    },
    Mutation: {
      sendResume(_, payload) {
        return resumeContactsApi.sendResume(payload);
      },
    },
  },
});
