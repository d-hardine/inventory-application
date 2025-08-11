const { Pool } = require("pg");
require('dotenv').config();

module.exports = new Pool({
    host: "localhost", // or wherever the db is hosted
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432 // The default port
});