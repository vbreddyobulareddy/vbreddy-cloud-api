const { makeExecutableSchema } = require("@graphql-tools/schema");
const authbaseDao = require("./controller.js");

module.exports = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type CodeValue {
      id: Int!
      name: String!
      description: String!
      codeId: Int
    }
    type OrgUnit {
      id: Int!
      name: String!
      email: String!
      mobile: String!
      address: String!
      parentOrgUnitId: Int
    }
    type Person {
      id: Int!
      name: String!
      email: String
      mobile: String!
      userName: String!
      address: String
    }
    type OrgUnitPerson {
      id: Int!
      orgUnit: OrgUnit
      person: Person
      codeValue: CodeValue
      isActive: Boolean
    }

    type Query {
      getToken(userName: String!, password: String!): OrgUnitPerson!
      getOrgUnitTypes: CodeValue!
    }

    type Mutation {
      signUpTravelBookTaker(
        orgUnitName: String!
        orgUnitEmail: String!
        orgUnitMobile: String!
        orgUnitAddress: String!
        orgUnitTypeId: Int!
        primPersonName: String!
        primPersonEmail: String!
        primPersonMobile: String!
        primPersonUserName: String!
        primPersonPassword: String!
        primPersonAddress: String!
      ): OrgUnitPerson!
    }
  `,
  resolvers: {
    Query: {
      getToken(_, payload) {
        return authbaseDao.getToken(payload);
      },
      getOrgUnitTypes() {
        return authbaseDao.getOrgUnitTypes();
      },
    },
    Mutation: {
      signUpTravelBookTaker(_, payload) {
        return authbaseDao.signUpTravelBookTaker(payload);
      },
    },
  },
});
