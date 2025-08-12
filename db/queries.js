const pool = require("./pool");
const format = require('pg-format');

async function getAllGames() {
    const { rows } = await pool.query(
        `SELECT games.id, games.game_name, games.release_year, string_agg(genres.genre, ', ') as "genre", publishers.publisher FROM games
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
    for(let i = 0; i < genres.length; i++)
        await pool.query("INSERT INTO games_genres (gameid, genreid) VALUES ($1, $2)", [newGameId, genres[i]]);
}

async function deleteGame(id) {
    await pool.query("DELETE FROM games WHERE id=($1);", [id]);
    await pool.query("DELETE FROM games_publishers WHERE gameid=($1)", [id]);
    await pool.query("DELETE FROM games_genres WHERE gameid=($1)", [id]);
}

async function filterGame(publishers, genres) {
    if(publishers && !genres) {
        const { rows } = await pool.query(format(
            `SELECT games.id, games.game_name, games.release_year, string_agg(genres.genre, ', ') as "genre", publishers.publisher FROM games
            INNER JOIN games_genres ON games.id = games_genres.gameid
            INNER JOIN genres ON games_genres.genreid = genres.id
            INNER JOIN games_publishers ON games.id = games_publishers.gameid
            INNER JOIN publishers ON games_publishers.publisherid = publishers.id
            WHERE games.id IN (SELECT gameid FROM games_publishers WHERE publisherid IN (%L))
            GROUP BY games.id, publishers.publisher ORDER BY games.game_name
        ;`, publishers))
        return rows
    } else if(!publishers && genres) {
        const { rows } = await pool.query(format(
            `SELECT games.id, games.game_name, games.release_year, string_agg(genres.genre, ', ') as "genre", publishers.publisher FROM games
            INNER JOIN games_genres ON games.id = games_genres.gameid
            INNER JOIN genres ON games_genres.genreid = genres.id
            INNER JOIN games_publishers ON games.id = games_publishers.gameid
            INNER JOIN publishers ON games_publishers.publisherid = publishers.id
            WHERE games.id IN (SELECT gameid FROM games_genres WHERE genreid IN (%L))
            GROUP BY games.id, publishers.publisher ORDER BY games.game_name
        ;`, genres))
        return rows
    } else {
        const { rows } = await pool.query(format(
            `SELECT games.id, games.game_name, games.release_year, string_agg(genres.genre, ', ') as "genre", publishers.publisher FROM games
            INNER JOIN games_genres ON games.id = games_genres.gameid
            INNER JOIN genres ON games_genres.genreid = genres.id
            INNER JOIN games_publishers ON games.id = games_publishers.gameid
            INNER JOIN publishers ON games_publishers.publisherid = publishers.id
            WHERE games.id IN (SELECT gameid FROM games_genres WHERE genreid IN (%L))
            AND games.id IN (SELECT gameid FROM games_publishers WHERE publisherid IN (%L))
            GROUP BY games.id, publishers.publisher ORDER BY games.game_name
        ;`, genres, publishers))
        return rows        
    }
}

async function searchGame(search) {
    const { rows } = await pool.query(
        `SELECT games.id, games.game_name, games.release_year, string_agg(genres.genre, ', ') as "genre", publishers.publisher FROM games
            INNER JOIN games_genres ON games.id = games_genres.gameid
            INNER JOIN genres ON games_genres.genreid = genres.id
            INNER JOIN games_publishers ON games.id = games_publishers.gameid
            INNER JOIN publishers ON games_publishers.publisherid = publishers.id
            WHERE games.game_name ILIKE ($1)
            GROUP BY games.id, publishers.publisher ORDER BY games.game_name
        ;`, [`%${search}%`]
    );
    return rows
}

async function fetchEditedGame(id) {
    const { rows } = await pool.query(`SELECT * FROM games WHERE id = ($1);`, [id])
    return rows
}

async function fetchEditedPublisher(id) {
    const { rows } = await pool.query("SELECT * FROM games_publishers WHERE gameid = ($1);", [id])
    return rows
}

async function fetchEditedGenre(id) {
    const { rows } = await pool.query("SELECT * FROM games_genres WHERE gameid = ($1) ORDER BY genreid;", [id])
    return rows
}

async function updateGame(gameName, releaseYear, publisher, genres, id) {
    await pool.query("UPDATE games SET game_name = ($1), release_year= ($2) WHERE id = ($3);", [gameName, releaseYear, id])
    await pool.query("UPDATE games_publishers SET publisherid = ($1) WHERE gameid = ($2);", [publisher, id])
    await pool.query("DELETE FROM games_genres WHERE gameid=($1);", [id])
    for(let i = 0; i < genres.length; i++)
        await pool.query("INSERT INTO games_genres (gameid, genreid) VALUES ($1, $2)", [id, genres[i]]);
}

module.exports = {
    getAllGames,
    getAllPublishers,
    getAllGenres,
    insertNewGame,
    deleteGame,
    filterGame,
    searchGame,
    fetchEditedGame,
    fetchEditedPublisher,
    fetchEditedGenre,
    updateGame
};
