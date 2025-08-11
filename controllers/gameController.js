const db = require('../db/queries')

async function getGames(req, res) {
    const games = await db.getAllGames()
    //res.send("Games: " + games.map(game => game.game_name).join(", "))
    res.render('index', {games: games})
}

async function createNewGameGet(req, res) {
    const publishers = await db.getAllPublishers()
    const genres = await db.getAllGenres()
    res.render('newDb', {publishers: publishers, genres: genres})
}

async function createNewGamePost(req, res) {
    const { gameName, releaseYear, publisher, genres } = req.body
    console.log(gameName, releaseYear, publisher, genres)
    await db.insertNewGame(gameName, releaseYear, publisher, genres)
    res.redirect('/')
}

async function deleteGamePost(req, res) {
    const { id } = req.body
    await db.deleteGame(id)
    res.redirect('/')
}

async function searchGet(req, res) {
    const { search } = req.query
    const searchResults = await db.searchUsername(search)
    res.render('search', {usernames: searchResults})
}

module.exports = { getGames, createNewGameGet, createNewGamePost, deleteGamePost, searchGet }