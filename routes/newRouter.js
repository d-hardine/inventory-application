const { Router } = require("express")
const newController = require('../controllers/newController')
const newRouter = Router()

newRouter.get("/", newController.getUsernames)
newRouter.post("/", newController.deleteUsernamePost)
newRouter.get("/new", newController.createUsernameGet)
newRouter.post("/new", newController.createUsernamePost)
newRouter.get("/search", newController.searchGet)

module.exports = newRouter