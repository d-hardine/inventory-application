const { Pool } = require("pg");

// All of the following properties should be read from environment variables
module.exports = new Pool({
    host: "localhost", // or wherever the db is hosted
    user: "dhiva",
    database: "top_users",
    password: "12349876",
    port: 5432 // The default port
});
