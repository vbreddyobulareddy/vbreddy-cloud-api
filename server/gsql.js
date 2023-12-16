const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const logger = require("./logger.js");
const createTcpPool = require('./cloud-sql-serve/connect-tcp.js');
const createUnixSocketPool = require('./cloud-sql-serve/connect-unix.js');

const client = new SecretManagerServiceClient();
async function accessSecretVersion(secretName) {
  const [version] = await client.accessSecretVersion({ name: secretName });
  return version.payload.data;
}

const createPool = async (env) => {
  const config = {
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0,
  };

  const { CLOUD_SQL_CREDENTIALS_SECRET } = env;
  if (CLOUD_SQL_CREDENTIALS_SECRET) {
    const secrets = await accessSecretVersion(CLOUD_SQL_CREDENTIALS_SECRET);
    try {
      env.DB_PASS = secrets.toString();
    } catch (err) {
      err.message = `Unable to parse secret from Secret Manager. Make sure that the secret is JSON formatted: \n ${err.message} `;
      throw err;
    }
  }

  if (env.INSTANCE_HOST) {
    return createTcpPool(config);
  } else if (env.INSTANCE_UNIX_SOCKET) {
    return createUnixSocketPool(config);
  } else {
    throw "Set either the `INSTANCE_HOST` or `INSTANCE_UNIX_SOCKET` environment variable.";
  }
};
const ensureSchema = async (pool) => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS votes
      ( vote_id SERIAL NOT NULL, time_cast timestamp NOT NULL,
      candidate CHAR(6) NOT NULL, PRIMARY KEY (vote_id) );`
  );
  console.log("Ensured that table 'votes' exists");
};
module.exports = {
  createPoolAndEnsureSchema: async (env) => {
    return await createPool(env)
      .then(async (pool) => {
        await ensureSchema(pool);
        return pool;
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  },
};
