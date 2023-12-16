const express = require("express");
const cors = require("cors");

const logger = require("./logger.js")
const gSQL = require("./gsql.js");
const appInstance = require("./app.js");

require('dotenv').config()

const app = express();
app.set("view engine", "pug");
app.enable("trust proxy");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

let pool;
app.use(async (req, res, next) => {
  if (pool) {
    return next();
  }
  try {
    pool = await gSQL.createPoolAndEnsureSchema(process.env);
    next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
});
const endpoint = appInstance.graphQLServerInstance(app);
const PORT = parseInt(process.env.PORT) || 8080;
module.exports = app.listen(PORT, () => {
  console.log(`GraphQL API located at http://localhost:${PORT}${endpoint}`);
});
