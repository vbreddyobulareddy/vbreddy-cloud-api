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

    type DuplicateResult {
      count: Int
    }

    type Query {
      getOrgUnitTypes: CodeValue!
      getTokenDetails(authToken: String!): Token
      checkDuplicateEmail(key: String!, val: String!): DuplicateResult
      checkDuplicateMobile(key: String!, val: String!): DuplicateResult
      checkDuplicateUserName(key: String!, val: String!): DuplicateResult
    }

    type Mutation {
      getToken(userName: String!, password: String!): Token!
      setOrgUnitPerson(
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
        return authbaseController.getTokenDetails(payload);
      },
      checkDuplicateEmail(_, payload) {
        return authbaseController.checkDuplicateEmail(payload);
      },
      checkDuplicateMobile(_, payload) {
        return authbaseController.checkDuplicateMobile(payload);
      },
      checkDuplicateUserName(_, payload) {
        return authbaseController.checkDuplicateUserName(payload);
      },
    },
    Mutation: {
      getToken(_, payload) {
        return authbaseController.getToken(payload);
      },
      setOrgUnitPerson(_, payload) {
        return authbaseController.setOrgUnitPerson(payload);
      },
    },
  },
});
