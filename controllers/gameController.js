const db = require('../db/queries')
const { body, validationResult } = require('express-validator')

const validateGame = body('genres').notEmpty().withMessage('At least pick one genre before submit')

async function getGames(req, res) {
    const games = await db.getAllGames()
    const publishers = await db.getAllPublishers()
    const genres = await db.getAllGenres()
    res.render('index', {games: games, publishers: publishers, genres: genres})
}

async function createNewGameGet(req, res) {
    const publishers = await db.getAllPublishers()
    const genres = await db.getAllGenres()
    res.render('newDb', {publishers: publishers, genres: genres})
}

async function createNewGamePost(req, res) {
    const results = validationResult(req)
    if(results.isEmpty()) {
        const { gameName, releaseYear, publisher, genres } = req.body
        await db.insertNewGame(gameName, releaseYear, publisher, genres)
        return res.redirect('/')
    } else { //if error, which is genres checkboxes not checked at least one
        const publishers = await db.getAllPublishers()
        const genres = await db.getAllGenres()
        res.status(400).render('newDb', {publishers: publishers, genres: genres, error: results.array()})
    }

}

async function deleteGamePost(req, res) {
    const { id } = req.body
    await db.deleteGame(id)
    res.redirect('/')
}

async function editGameGet(req, res) {
    const editedGame = await db.fetchEditedGame(req.params.id)
    const fetchEditedPublisher = await db.fetchEditedPublisher(req.params.id)
    const fetchEditedGenre = await db.fetchEditedGenre(req.params.id)
    const publishers = await db.getAllPublishers()
    const genres = await db.getAllGenres()
    res.render('editDb', {
        editedGame: editedGame,
        fetchEditedPublisher: fetchEditedPublisher,
        fetchEditedGenre: fetchEditedGenre,
        publishers: publishers,
        genres: genres
    })
}

async function editGamePost(req, res) {
    const results = validationResult(req)
    if(results.isEmpty()) {
        const { gameName, releaseYear, publisher, genres, id } = req.body
        await db.updateGame(gameName, releaseYear, publisher, genres, id)
        res.redirect('/')
    }
    else { //if error, which is genres checkboxes not checked at least one
        const editedGame = await db.fetchEditedGame(req.body.id)
        const fetchEditedPublisher = await db.fetchEditedPublisher(req.body.id)
        const fetchEditedGenre = await db.fetchEditedGenre(req.body.id)
        const publishers = await db.getAllPublishers()
        const genres = await db.getAllGenres()
        res.status(400).render('editDb', {publishers: publishers, genres: genres, error: results.array()})
        res.render('editDb', {
            editedGame: editedGame,
            fetchEditedPublisher: fetchEditedPublisher,
            fetchEditedGenre: fetchEditedGenre,
            publishers: publishers,
            genres: genres,
            error: results.array()
        })
    }
 
}

async function filterGameGet(req, res) {
    const { publishers, genres } = req.query
    const filteredGames = await db.filterGame(publishers, genres)
    const filteredPublishers = await db.getAllPublishers()
    const filteredGenres = await db.getAllGenres()
    res.render('filter', {games: filteredGames, publishers: filteredPublishers, genres: filteredGenres})
}

async function searchGet(req, res) {
    const { search } = req.query
    const searchResults = await db.searchGame(search)
    res.render('search', {searchGames: searchResults})
}

module.exports = {
    validateGame,
    getGames,
    createNewGameGet,
    createNewGamePost,
    deleteGamePost,
    editGameGet,
    editGamePost,
    filterGameGet,
    searchGet
}