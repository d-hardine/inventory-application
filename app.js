const express = require('express')
const app = express()
const newRouter = require("./routes/newRouter")

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))
app.use("/", newRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`))

//env stuff
require('dotenv').config()
//console.log(process.env)