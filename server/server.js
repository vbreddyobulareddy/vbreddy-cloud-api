const express = require("express");
const appInstance = require("./app.js");

const app = express();
const endpoint = appInstance.graphQLServerInstance(app);
const PORT = parseInt(process.env.PORT) || 8080;
module.exports = app.listen(PORT, () => {
  console.log(`GraphQL API located at http://localhost:${PORT}${endpoint}`);
});
