import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controllers/userController.js" // note: controllers
const userRouter = express.Router()

userRouter.get("/getcurrentuser", isAuth, getCurrentUser)

export default userRouter
