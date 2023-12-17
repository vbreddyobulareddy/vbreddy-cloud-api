module.exports = {
  ResumeContactsSchema: async (pool) => {
    return await pool.query(
      ` CREATE TABLE IF NOT EXISTS ResumeContacts (
            id int NOT NULL AUTO_INCREMENT,
            email varchar(255) NOT NULL,
            status varchar(255) NOT NULL,
            type varchar(255),
            createdDate timestamp NOT NULL,
            modifiedDate timestamp NOT NULL,
            PRIMARY KEY (id)
          );`
    );
  },
};
