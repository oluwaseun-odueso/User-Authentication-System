const Sequelize = require('sequelize');
require('dotenv').config();

const database = process.env.SQ_DATABASE;
const username = process.env.SQ_USERNAME;
const password = process.env.SQ_PASSWORD;
const host = process.env.SQ_HOST;

if (!database || !username || !password) {
  throw new Error(
    "Missing required environment variables for database connection"
  );
}

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.log("Unable to connect to the database:", error));

module.exports = sequelize;