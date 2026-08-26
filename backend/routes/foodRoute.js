import express from "express";
import {
    addFood,
    listFood,
    removeFood
} from "../controllers/foodcontroller.js";

import multer from "multer";

const foodRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// routes
foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", removeFood);

export default foodRouter;