const createTcpPool = require("./connect-tcp.js");
const createUnixSocketPool = require("./connect-unix.js");
const logger = require("./../logger.js");

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { ensureSchema } = require("./ensure-schema.js");
const connectionPoolStack = [];
const client = new SecretManagerServiceClient();
async function accessSecretVersion(secretName) {
  const [version] = await client.accessSecretVersion({ name: secretName });
  return version.payload.data;
}
const createPool = async () => {
  const config = {
    connectionLimit: 5,
    connectTimeout: 10000, // 10 seconds
    acquireTimeout: 10000, // 10 seconds
    waitForConnections: true, // Default: true
    queueLimit: 0, // Default: 0
  };

  const { CLOUD_SQL_CREDENTIALS_SECRET } = process.env;
  if (CLOUD_SQL_CREDENTIALS_SECRET) {
    const secrets = await accessSecretVersion(CLOUD_SQL_CREDENTIALS_SECRET);
    try {
      process.env.DB_PASS = secrets.toString();
    } catch (err) {
      err.message = `Unable to parse secret from Secret Manager. Make sure that the secret is JSON formatted: \n ${err.message} `;
      throw err;
    }
  }

  if (process.env.INSTANCE_HOST) {
    return createTcpPool(config);
  } else if (process.env.INSTANCE_UNIX_SOCKET) {
    return createUnixSocketPool(config);
  } else {
    throw "Set either the `INSTANCE_HOST` or `INSTANCE_UNIX_SOCKET` environment variable.";
  }
};

const createPoolAndEnsureSchema = async () => {
  return await createPool()
    .then(async (pool) => {
      return pool;
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });
};

module.exports = {
  getConnection: async () => {
    if (connectionPoolStack.length === 0) {
      try {
        const pool = await createPoolAndEnsureSchema();
        connectionPoolStack.push(pool);
      } catch (err) {
        logger.error(err);
        console.log("--==getConnection ", err);
      }
    }
    return connectionPoolStack.pop();
  },
};
