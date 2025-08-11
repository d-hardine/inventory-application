const pool = require("./pool");

async function getAllGames() {
    const { rows } = await pool.query("SELECT * FROM games");
    return rows;
}

async function insertUsername(username) {
    await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
}

async function deleteUsername(id) {
    await pool.query("DELETE FROM games WHERE id=($1);", [id]);
}

async function searchUsername(search) {
    const { rows } = await pool.query("SELECT * FROM usernames WHERE username ILIKE ($1);", [`%${search}%`]);
    return rows
}

module.exports = {
    getAllGames, insertUsername, deleteUsername, searchUsername
};
