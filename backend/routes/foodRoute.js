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
foodRouter.post(
    "/add",
    (req, res, next) => {
        upload.single("image")(req, res, (error) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.code === "LIMIT_FILE_SIZE"
                        ? "Image must be 5 MB or smaller"
                        : error.message
                });
            }

            next();
        });
    },
    addFood
);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", removeFood);

export default foodRouter;
