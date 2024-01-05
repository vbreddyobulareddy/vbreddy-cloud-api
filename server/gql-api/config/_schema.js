module.exports = {
  ConfigSchema: async (pool) => {
    console.log("---> Call  Ensure ConfigSchema <---");
    return await pool.query(
      ` CREATE TABLE IF NOT EXISTS Config (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            desc varchar(500),
            value varchar(1000),
            isJsonVal boolean,
            isActive boolean,
            PRIMARY KEY (id)
        );`
    );
  },
};
