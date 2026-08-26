import express from "express"
import {loginUser, registerUser} from  '../controllers/userContraller.js'

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/getuser", authMiddlewere, getUserDetails);

export default userRouter