const { stitchSchemas } = require("@graphql-tools/stitch");

const reviewsschema = require("./reviews/index.js");
const votesschema = require("./votes/index.js");
const connectionsSchema = require("./connections/index.js");
const resumeContactsSchema = require("./resume-contacts/index.js");

module.exports = stitchSchemas({
  subschemas: [
    reviewsschema,
    votesschema,
    connectionsSchema,
    resumeContactsSchema,
  ],
});
