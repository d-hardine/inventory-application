const db = require('../db/queries')

async function getGames(req, res) {
    const games = await db.getAllGames()
    //res.send("Games: " + games.map(game => game.game_name).join(", "))
    res.render('index', {games: games})
}

function createUsernameGet(req, res) {
    res.render('newDb')
}

async function createUsernamePost(req, res) {
    const { username } = req.body
    await db.insertUsername(username)
    res.redirect('/')
}

async function deleteUsernamePost(req, res) {
    const { id } = req.body
    await db.deleteUsername(id)
    res.redirect('/')
}

async function searchGet(req, res) {
    const { search } = req.query
    const searchResults = await db.searchUsername(search)
    res.render('search', {usernames: searchResults})
}

module.exports = { getGames, createUsernameGet, createUsernamePost, deleteUsernamePost, searchGet }