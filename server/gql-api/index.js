const { stitchSchemas } = require("@graphql-tools/stitch");

const votesschema = require("./votes/index.js");
const connectionsSchema = require("./connections/index.js");
const resumeContactsSchema = require("./resume-contacts/index.js");

module.exports = stitchSchemas({
  subschemas: [
    votesschema,
    connectionsSchema,
    resumeContactsSchema,
  ],
});
