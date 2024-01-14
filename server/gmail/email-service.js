"use strict";
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const MailComposer = require("nodemailer/lib/mail-composer");
const { getGoogleClient } = require("./auth-service");
const gmail = google.gmail("v1");

const getDocResume = async () => {
  return new Promise((resolve, reject) => {
    const files = {};
    fs.readFile(
      path.join(__dirname, "/vbreddy_9Y_Profile.docx"),
      { encoding: "base64" },
      function (err, data) {
        files.docx = data;
        if (Object.keys(files).length === 2) {
          resolve(files);
        }
      }
    );
    fs.readFile(
      path.join(__dirname, "/vbreddy_9Y_Profile.pdf"),
      { encoding: "base64" },
      function (err, data) {
        files.pdf = data;
        if (Object.keys(files).length === 2) {
          resolve(files);
        }
      }
    );
  });
};

async function dropMyResumeViaGmailService(
  toEmailAddress = "veerareddy.obula@gmail.com"
) {
  getGoogleClient().then(async () => {
    getDocResume().then((response) => {
      let mail = new MailComposer({
        from: "vbreddy.obulareddy@gmail.com",
        to: toEmailAddress,
        html: `
        <p style="font-family: Verdana,Geneva,sans-serif">
        Hi Team, <br/> 
        <p style="font-family: Verdana,Geneva,sans-serif">&ensp;&ensp;&ensp;I am a <strong>JavaScript Full-Stack Developer</strong>. 
        I have robust background in full stack development using Node.JS frameworks and Javascript UI libraries.
        I have a passion of creating efficient and scalable applications, and a proven track record of delivering high-quality code. <p/>
        <p style="font-family: Verdana,Geneva,sans-serif">&ensp;&ensp;&ensp;During my 10 years of experience in software development, I have honed my skills in both frontend and backend technologies. 
        My proficiency in JavaScript, along with frameworks like React.JS, Redux and vue3, has allowed me to craft engaging and user-friendly 
        interfaces while ensuring seamless interactions. Additionally, I have a strong command of server-side technologies such as Express.js, 
        GraphQL, Next.JS and experience in working with databases like Google Cloud SQL, PostgreSQL.</p> 
        <p style="font-family: Verdana,Geneva,sans-serif">&ensp;&ensp;&ensp;I am excited about the prospect of discussing how my background, skills, and enthusiasm align with the goals of your company. 
        Thank you for visting my portal (<a href="https://vbreddy.life">vbreddy.life</a>) and considering my profile. I am looking forward to the possibility of contributing to your team and am available at your 
        earliest convenience for an interview.</p>
        <p style="font-family: Verdana,Geneva,sans-serif">
        Warm Regards, <br/>
        Veera Bhargava Reddy Obulareddy (VBReddy) <br />
        +1 404 448 1224 <br/>
        vbreddy.obulareddy@outlook.com <br/>
        --- <br/>
        <strong>This is an auto generated email from <a href="https://vbreddy.life">vbreddy.life</a></strong>
        </p>
        </p>
        `,
        subject: "JavaScript Full-Stack Developer",
        textEncoding: "base64",
        attachments: [
          {
            filename: "vbreddy_9Y_Profile.docx",
            content: Buffer(response.docx, "base64"),
          },
          {
            filename: "vbreddy_9Y_Profile.pdf",
            content: Buffer(response.pdf, "base64"),
          },
        ],
      });
      mail.compile().build((error, msg) => {
        if (error) return console.log("Error compiling email " + error);

        const encodedMessage = Buffer.from(msg)
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        gmail.users.messages.send(
          {
            userId: "me",
            resource: {
              raw: encodedMessage,
            },
          },
          (err, result) => {
            if (err)
              return console.log(
                "NODEMAILER - The API returned an error: " + err
              );

            console.log(
              "NODEMAILER - Sending email reply from server:",
              result.data
            );
          }
        );
      });
      // ----
    });
    /*
    const resumePath = path.join(__dirname, "/vbreddy_9Y_Profile.docx");
    fs.readFile(resumePath, { encoding: "base64" }, function (err, data) {
      let mail = new MailComposer({
        from: "vbreddy.obulareddy@gmail.com",
        to: toEmailAddress,
        text: "I hope this works",
        html: " <strong> I hope this works </strong>",
        subject: "Test email gmail-nodemailer-composer",
        textEncoding: "base64",
        attachments: [
          {
            // encoded string as an attachment
            filename: "vbreddy_9Y_Profile.docx",
            content: Buffer(data, 'base64'),
          },
        ],
      });
      mail.compile().build((error, msg) => {
        if (error) return console.log("Error compiling email " + error);

        const encodedMessage = Buffer.from(msg)
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        // const gmail = google.gmail({ version: "v1", auth });
        gmail.users.messages.send(
          {
            userId: "me",
            resource: {
              raw: encodedMessage,
            },
          },
          (err, result) => {
            if (err)
              return console.log(
                "NODEMAILER - The API returned an error: " + err
              );

            console.log(
              "NODEMAILER - Sending email reply from server:",
              result.data
            );
          }
        );
      });
    });
    */
    /*const messageParts = [];
    messageParts.push(`From: vbreddy.obulareddy@gmail.com`);
    messageParts.push(`To: ${toEmailAddress}`);
    messageParts.push("Content-Type: text/html; charset=utf-8");
    messageParts.push("MIME-Version: 1.0");
    messageParts.push(`Subject: Javascript Full-Stack Developer`);
    messageParts.push("");
    messageParts.push("This is new Format Constructor");
    messageParts.push("So... <b>Hello VEERA!</b>  🤘❤️😎");
    messageParts.push("autogenerated email from : <a href='https://vbreddy.life'>vbreddy.life</a>");
    console.log("--==messageParts ", messageParts);
    const message = messageParts.join("\n");
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log(res.data);
    */
  });
}

module.exports = {
  dropMyResumeViaGmailService,
};
