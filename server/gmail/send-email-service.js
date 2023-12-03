const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');

const MailComposer = require('nodemailer/lib/mail-composer');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://mail.google.com',
  'https://www.googleapis.com/auth/gmail.readonly'
];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  //authorize(JSON.parse(content), listLabels);

  authorize(JSON.parse(content), sendEmail);

});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function sendEmail(auth) {

  // ----------nodemailer test----------------------------------------------------

  let mail = new MailComposer(
    {
      to: "FAKE_EMAIL@gmail.com",
      text: "I hope this works",
      html: " <strong> I hope this works </strong>",
      subject: "Test email gmail-nodemailer-composer",
      textEncoding: "base64",
      attachments: [
        {   // encoded string as an attachment
          filename: 'text1.txt',
          content: 'aGVsbG8gd29ybGQh',
          encoding: 'base64'
        },
        {   // encoded string as an attachment
          filename: 'text2.txt',
          content: 'aGVsbG8gd29ybGQh',
          encoding: 'base64'
        },
      ]
    });

  mail.compile().build( (error, msg) => {
    if (error) return console.log('Error compiling email ' + error);

    const encodedMessage = Buffer.from(msg)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedMessage,
      }
    }, (err, result) => {
      if (err) return console.log('NODEMAILER - The API returned an error: ' + err);

      console.log("NODEMAILER - Sending email reply from server:", result.data);
    });

  })

  // ----------nodemailer test----------------------------------------------------


}