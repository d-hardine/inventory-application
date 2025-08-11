const { Router } = require("express")
const gameController = require('../controllers/gameController')
const gameRouter = Router()

gameRouter.get("/", gameController.getGames)
gameRouter.post("/", gameController.deleteGamePost)
gameRouter.get("/new", gameController.createNewGameGet)
gameRouter.post("/new", gameController.createNewGamePost)
gameRouter.get("/search", gameController.searchGet)

module.exports = gameRouter