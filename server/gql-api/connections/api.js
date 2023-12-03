const { getConnection } = require("./../../cloud-sql-serve/index.js");

module.exports = {
  getAllConnections: async () => {
    const connection = await getConnection();
    const rows = await connection.query(`SELECT * FROM Connection`);
    return rows;
  },
  getAllReplies: async () => {
    const connection = await getConnection();
    const rows = await connection.query(`SELECT * FROM Replies`);
    return rows;
  },
  addNewConnect: async (payload) => {
    try {
      const connection = await getConnection();
      var newConnect = await connection.query("INSERT INTO Connection SET ?", {
        name: payload.name,
        email: payload.email,
        mobile: payload.mobile,
      });

      console.log("---=addNewConnect<:-4-:>newConnect", newConnect);
      const [newRow] = await connection.query(
        `SELECT * FROM Connection WHERE id = ${newConnect.insertId}`
      );
      console.log("---=addNewConnect<:-4-:>newRow", newRow);
      await connection.query("INSERT INTO Replies SET ?", {
        connectionId: newRow.id,
        comment: payload.comment,
      });
      return newRow;
    } catch (e) {
      console.log("--==addNewConnect ", e);
    }
  },
  addReply: async (payload) => {
    try {
      const connection = await getConnection();
      var newReply = await connection.query("INSERT INTO Replies SET ?", {
        connectionId: payload.connectionId,
        comment: payload.comment,
      });

      console.log("---=addNewConnect<:-4-:>newReply", newReply);
      const [newRow] = await connection.query(
        `SELECT * FROM Replies WHERE id = ${newReply.insertId}`
      );
      console.log("---=addNewConnect<:-4-:>newRow", newRow);
      return newRow;
    } catch (e) {
      console.log("--==addNewConnect ", e);
    }
  },
};

/****
 * 
 * 
 * create table Connection ()
 * 
  CREATE TABLE Connection (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255),
    mobile varchar(255),
    PRIMARY KEY (id)
  );

  CREATE TABLE Replies (
    id int NOT NULL AUTO_INCREMENT,
    connectionId int,
    comment text NOT NULL,
    PRIMARY KEY (id)
  );
 * 
 */
