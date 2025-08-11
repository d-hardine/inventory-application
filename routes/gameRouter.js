const { Router } = require("express")
const gameController = require('../controllers/gameController')
const gameRouter = Router()

gameRouter.get("/", gameController.getGames)
gameRouter.post("/", gameController.deleteUsernamePost)
gameRouter.get("/new", gameController.createUsernameGet)
gameRouter.post("/new", gameController.createUsernamePost)
gameRouter.get("/search", gameController.searchGet)

module.exports = gameRouter