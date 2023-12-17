module.exports = {
  ConnectionSchema: async (pool) => {
    return await pool.query(
      ` CREATE TABLE IF NOT EXISTS Connection (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            email varchar(255),
            mobile varchar(255),
            PRIMARY KEY (id)
          );`
    );
  },
  RepliesSchema: async (pool) => {
    return await pool.query(
      ` CREATE TABLE IF NOT EXISTS Replies (
            id int NOT NULL AUTO_INCREMENT,
            connectionId int,
            comment text NOT NULL,
            PRIMARY KEY (id)
          );`
    );
  },
};
