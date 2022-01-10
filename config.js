const mysql = require('mysql2/promise');

// for use dotenv with pm2
require('dotenv').config();
//
const { DB_HOST, DB_PASSWORD, DB_SCHEMA, DB_USER, BACK_PORT, API_EXT_TOKEN } =
  process.env;
const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA,
});
const backPort = parseInt(BACK_PORT, 10);
module.exports = { backPort, db, API_EXT_TOKEN };
