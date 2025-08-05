const db = require('../db/queries')

async function getUsernames(req, res) {
    const usernames = await db.getAllUsernames()
    //console.log(usernames)
    //res.send("Usernames: " + usernames.map(user => user.username).join(", "))
    res.render('index', {usernames: usernames})
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
    console.log(searchResults)
    res.render('search', {usernames: searchResults})
}

module.exports = { getUsernames, createUsernameGet, createUsernamePost, deleteUsernamePost, searchGet }