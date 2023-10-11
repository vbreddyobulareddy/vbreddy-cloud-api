const { makeExecutableSchema } = require('@graphql-tools/schema');
const reviewsAPI = require('./datasources/ReviewsAPI.js')

module.exports = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type Review {
      id: Int!
      bookIsbn: String!
      rating: Int!
      comment: String
      book: Book
    }

    type Book {
      isbn: String
      reviews: [Review]
    }

    type Query {
      reviews: [Review!]!
      reviewsForBook(isbn: String): Book
    }
  `,
  resolvers: {
    Query: {
      reviews() {
        console.log('---=Context ', reviewsAPI);
        return reviewsAPI.getAllReviews();
      },
      reviewsForBook(_, { isbn }) {
        const reviews = reviewsAPI.getReviewsForBook(isbn);
        return { isbn, reviews };
      },
    },
    Review: {
      book: (review) => {
        return { isbn: review.bookIsbn };
      },
    },
  },
});
