import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controller/getCurrentUser.js"

const userRouter = express.Router()

userRouter.get("/getcurrentuser", isAuth,getCurrentUser)

export default userRouter
