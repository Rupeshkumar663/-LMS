import express from "express"
import { login, logOut, signUp } from "../controller/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.post("/logout", logOut)  

export default authRouter
