const { VotesSchema } = require("./../gql-api/votes/_schema.js");
const {
  ResumeContactsSchema,
} = require("./../gql-api/resume-contacts/_schema.js");
const {
  ConnectionSchema,
  RepliesSchema,
} = require("./../gql-api/connections/_schema.js");
const { AuthBaseSchema } = require("../gql-api/authbase/_schema.js");
module.exports = {
  ensureSchema: async (pool) => {
    console.log("---> Ensure DataBase Schema <---");
    await VotesSchema(pool);
    await ResumeContactsSchema(pool);
    await ConnectionSchema(pool);
    await RepliesSchema(pool);
    await AuthBaseSchema(pool);
  },
};
