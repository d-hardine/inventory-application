const pool = require("./pool");

async function getAllGames() {
    const { rows } = await pool.query(
        `SELECT games.game_name, games.release_year, string_agg(genres.genre, ', ') as "genre", publishers.publisher FROM games
            INNER JOIN games_genres ON games.id = games_genres.gameid
            INNER JOIN genres ON games_genres.genreid = genres.id
            INNER JOIN games_publishers ON games.id = games_publishers.gameid
            INNER JOIN publishers ON games_publishers.publisherid = publishers.id
            GROUP BY games.id, publishers.publisher ORDER BY games.game_name
        ;`
    );
    return rows;
}

async function getAllPublishers() {
    const { rows } = await pool.query(`SELECT * FROM publishers;`);
    return rows;
}

async function getAllGenres() {
    const { rows } = await pool.query(`SELECT * FROM genres;`);
    return rows;
}

async function insertNewGame(gameName, releaseYear, publisher, genres) {
    await pool.query("INSERT INTO games (game_name, release_year) VALUES ($1, $2)", [gameName, releaseYear]);
    const { rows } = await pool.query(`SELECT * FROM games WHERE game_name=($1)`, [gameName])
    const newGameId = rows[0].id
    await pool.query("INSERT INTO games_publishers (publisherid, gameid) VALUES ($1, $2)", [publisher, newGameId]);
    for(let i = 0; i < genres.length; i++) {
        await pool.query("INSERT INTO games_genres (gameid, genreid) VALUES ($1, $2)", [newGameId, genres[i]]);
    }
}

async function deleteGame(id) {
    await pool.query("DELETE FROM games WHERE id=($1);", [id]);
}

async function searchUsername(search) {
    const { rows } = await pool.query("SELECT * FROM usernames WHERE username ILIKE ($1);", [`%${search}%`]);
    return rows
}

module.exports = {
    getAllGames, getAllPublishers, getAllGenres, insertNewGame, deleteGame, searchUsername
};
