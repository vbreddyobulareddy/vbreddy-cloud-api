const { getConnection } = require("../../cloud-sql-serve/index.js");
const { dropMyResumeViaGmailService } = require("../../gmail/email-service.js");

module.exports = {
  fetchAllResumeContacts: async () => {
    const connection = await getConnection();
    const contacts = await connection.query(
      "SELECT id, email, status, type FROM ResumeContacts ORDER BY email"
    );
    console.log("--== Connection is ready ", contacts);

    return [
      {
        id: 1,
        email: "veerareddy.obula@gmail.com",
        status: "draft",
        type: "contact",
      },
    ];
  },
  sendResume: async (payload) => {
    const connection = await getConnection();
    var newReply = await connection.query("INSERT INTO ResumeContacts SET ?", {
      email: payload.email,
      status: "draft",
      type: "contact",
      createdDate: new Date(),
      modifiedDate: new Date(),
    });

    console.log("---=addNewConnect<:-4-:>newReply", newReply);
    const [newRow] = await connection.query(
      `SELECT * FROM ResumeContacts WHERE id = ${newReply.insertId}`
    );
    await dropMyResumeViaGmailService(payload.email);
    return newRow;
  },
};
