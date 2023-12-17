module.exports = {
  VotesSchema: async (pool) => {
    return await pool.query(
      `CREATE TABLE IF NOT EXISTS votes ( 
            vote_id SERIAL NOT NULL, 
            time_cast timestamp NOT NULL,
            candidate CHAR(6) NOT NULL, 
            PRIMARY KEY (vote_id) 
          );`
    );
  },
};
