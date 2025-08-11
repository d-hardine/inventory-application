const express = require('express')
const path = require("node:path");
const app = express()
const assetsPath = path.join(__dirname, "public"); //needed to connect css
app.use(express.static(assetsPath)); //needed to connect css
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))
const gameRouter = require("./routes/gameRouter")

app.use("/", gameRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`))