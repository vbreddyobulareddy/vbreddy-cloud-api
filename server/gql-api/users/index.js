const { makeExecutableSchema } = require("@graphql-tools/schema");
const reviewsAPI = require("./datasources/ReviewsAPI.js");

module.exports = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      username: String!
      email: String!
      avatar: String
    }

    type Mutation {
      signUp(username: String!, email: String!, password: String!): String!
      signIn(username: String, email: String, password: String!): String!
    }
  `,
  resolvers: {
    Mutation: {
      reviews() {
        console.log("---=Context ", reviewsAPI);
        return reviewsAPI.getAllReviews();
      },
      reviewsForBook(_, { isbn }) {
        const reviews = reviewsAPI.getReviewsForBook(isbn);
        return { isbn, reviews };
      },
    },
  },
});
