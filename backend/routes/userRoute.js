import express from "express";

import {
    loginUser,
    registerUser,
    getUserDetails
} from "../controllers/userContraller.js";

import authMiddlewere from "../middlewere/auth.js";


const userRouter = express.Router();


userRouter.post(
    "/login",
    loginUser
);


userRouter.post(
    "/register",
    registerUser
);


userRouter.get(
    "/getuser",
    authMiddlewere,
    getUserDetails
);


export default userRouter;