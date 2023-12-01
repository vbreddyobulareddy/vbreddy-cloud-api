const { makeExecutableSchema } = require("@graphql-tools/schema");
const connectUsAPI = require("./api.js");

module.exports = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type Connection {
      id: Int!
      name: String!
      email: String!
      mobile: String
      replies: [Replies]
    }

    type Replies {
      id: Int!
      connectionId: Int!
      comment: String!
    }

    type Query {
      connection: [Connection!]!
      replies: [Replies!]!
    }

    type Mutation {
      addNewConnect(name: String!, email: String!, mobile: String, comment: String!): Connection!
      addReply(connectionId: Int!, comment: String!): Replies!
    }
  `,
  resolvers: {
    Query: {
      connection() {
        console.log("---=Context ", connectUsAPI);
        return connectUsAPI.getAllConnections();
      },
      replies() {
        return connectUsAPI.getAllReplies();
      },
    },
    Mutation: {
      addNewConnect(_, payload) {
        return connectUsAPI.addNewConnect(payload);
      },
      addReply(_, payload) {
        return connectUsAPI.addReply(payload);
      },
    },
  },
});

/***
 * 
 * 
  mutation addNewConnect(
    $name:String!, 
    $email: String!, 
    $mobile: String, 
    $comment: String
  ) {
    addNewConnect(
      name: $name, 
      email:$email, 
      mobile: $mobile, 
      comment: $comment
  ) {
      id
      name
    }
  }
****
{
  "name": "Veera",
  "email": "obularedy.veera@gmail.com",
  "mobile": "8105555344",
  "comment": "Hello Veera this is new comment"
}
*
*
mutation addReply($connectionId:Int!, $comment: String!) {
  addReply(connectionId: $connectionId, comment:$comment) {
    id
    comment
  }
}
****
{
  "connectionId": 5,
  "comment": "Hello Veera"
}
*
*
 */
