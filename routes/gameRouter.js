const { Router } = require("express")
const gameController = require('../controllers/gameController')
const gameRouter = Router()

gameRouter.get("/", gameController.getGames)
gameRouter.post("/", gameController.deleteGamePost)
gameRouter.get("/filter", gameController.filterGameGet)
gameRouter.get("/new", gameController.createNewGameGet)
gameRouter.post("/new", gameController.createNewGamePost)
gameRouter.get("/search", gameController.searchGet)
gameRouter.get("/:id", gameController.editGameGet)
gameRouter.post("/:id", gameController.editGamePost)

module.exports = gameRouter