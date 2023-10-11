// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const express = require("express");
const cors = require("cors");
const gatewaySchema = require("./gql-api/index.js");
const { graphqlHTTP } = require("express-graphql");

const app = express();
let pool;
app.set("view engine", "pug");
app.enable("trust proxy");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("ip:", req.ip);
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: gatewaySchema,
    rootValue: {
      ip: function (args, request) {
        return request.ip;
      },
    },
    graphiql: true,
  })
);
app.use("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.sendFile(__dirname + "/views/index.html");
});

const PORT = parseInt(process.env.PORT) || 8080;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  throw err;
});

module.exports = server;
