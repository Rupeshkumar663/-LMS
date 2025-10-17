import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './route/authRoute.js'
dotenv.config()

import cors from "cors"

const port=process.env.PORT
const app=express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.get("/",(req,res)=>{
    res.send("Hello from server");
})


app.listen(port,()=>{
    console.log("start server");
    connectDb()
})