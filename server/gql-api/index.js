
const { stitchSchemas } = require("@graphql-tools/stitch");

const reviewsschema = require("./reviews/index.js");
const votesschema = require("./votes/index.js");
const connectionsSchema = require("./connect-us/index.js");


module.exports = stitchSchemas({
  subschemas: [reviewsschema, votesschema, connectionsSchema],
});;
