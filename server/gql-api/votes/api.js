const { getConnection } = require("./../../cloud-sql-serve/index.js")

module.exports = {
  getAllVotes: async () => {
    const connection = await getConnection();
    const votesList = await connection.query(
      "SELECT vote_id as id, candidate, time_cast as timeCast FROM votes ORDER BY time_cast DESC LIMIT 5"
    );
    console.log('--== Connection is ready ', votesList);

    return votesList;
  },
};
