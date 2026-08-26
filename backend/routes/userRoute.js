import express from "express";

import {
    loginUser,
    registerUser,
    getUser
} from "../controllers/userContraller.js";


const userRouter = express.Router();


userRouter.post("/login", loginUser);

userRouter.post("/register", registerUser);

userRouter.get("/getuser", getUser);


export default userRouter;