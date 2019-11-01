const express = require("express")
require("dotenv").config({path : ".env"});
require("./src/database/name");
const User = require("./src/models/users")
const userRouter = require("./src/authenticatingUser")

const app = express()
//app.set(express.json())
const PORT = process.env.PORT

app.use(express.json())
app.use("/users",userRouter)

app.listen(PORT , ()=>{
    console.log("the server is up in running ")
})