
const { connection } = require("./db")
const { userRouter } = require("./routes/user.routes")
const { postRouter}=require("./routes/post.routes")
const cors=require("cors")
require("dotenv").config()
const express=require("express")

const app= express()
app.use(cors())
app.use(express.json())
app.use("/users",userRouter)
app.use("/posts",postRouter)


app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log(`server is running at port ${process.env.port}`)
        console.log("connected to the db")
    } catch (error) {
        console.log(error)
    }
})