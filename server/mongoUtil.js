const MongoClient = require("mongodb").MongoClient;

let db;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "bakesaledb";

module.exports.init = async function init() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();

  db = client.db(dbName);

  await db.collection("users").createIndex({ email: 1 }, { unique: true });

  return db;
};

module.exports.getDb = () => db;
