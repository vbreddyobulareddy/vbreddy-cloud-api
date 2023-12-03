const fs = require("fs").promises;
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(path.join(__dirname, "/token.json"));
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(
    path.join(
      __dirname,
      "/client_secret_149452601190-pllj3qce1fjm6dtg59julqk1oorph5fk.apps.googleusercontent.com.json"
    )
  );
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(path.join(__dirname, "/token.json"), payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    google.options({ auth: client });
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: path.join(
      __dirname,
      "/client_secret_149452601190-pllj3qce1fjm6dtg59julqk1oorph5fk.apps.googleusercontent.com.json"
    ),
  });
  google.options({ auth: client });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

module.exports = {
  getGoogleClient: authorize,
};
