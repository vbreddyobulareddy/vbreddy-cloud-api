const { getConnection } = require("./../../cloud-sql-serve/index.js");

module.exports = {
  getConfigById: async () => {
    const connection = await getConnection();
    const rows = await connection.query(`SELECT * FROM Connection`);
    return rows;
  },
  setConfig: async () => {
    const connection = await getConnection();
    const rows = await connection.query(`SELECT * FROM Replies`);
    return rows;
  },
};
