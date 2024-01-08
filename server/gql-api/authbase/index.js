const { makeExecutableSchema } = require("@graphql-tools/schema");
const authbaseController = require("./controller.js");

module.exports = makeExecutableSchema({
  typeDefs: `
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

    type Token {
      id: Int
      token: String
      message: String
      mobile: String
      iat: Int 
      exp: Int
      orgUnitPerson: OrgUnitPerson
    }

    type Query {
      getOrgUnitTypes: CodeValue!
      getTokenDetails(authToken: String!): Token
    }

    type Mutation {
      getToken(userName: String!, password: String!): Token!
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
      getOrgUnitTypes() {
        return authbaseController.getOrgUnitTypes();
      },
      getTokenDetails(_, payload) {
        return authbaseController.getTokenDetails(payload)
      }
    },
    Mutation: {
      getToken(_, payload) {
        return authbaseController.getToken(payload);
      },
      signUpTravelBookTaker(_, payload) {
        return authbaseController.signUpTravelBookTaker(payload);
      },
    },
  },
});
