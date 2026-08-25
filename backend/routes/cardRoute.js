import express from "express";
import {addToCart, removeFromCart, getCart} from "../controllers/cardController.js";
import authMiddlewere from "../middlewere/auth.js";
const cartRouter = express.Router();


cartRouter.post("/add",authMiddlewere, addToCart);
cartRouter.post("/remove",authMiddlewere, removeFromCart);
cartRouter.post("/get",authMiddlewere, getCart);

export default cartRouter;