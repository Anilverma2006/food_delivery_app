import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { dbConnect } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cardRoute.js";
import orderRouter from "./routes/orderRoute.js";


dotenv.config();

const backendDirectory = path.dirname(
    fileURLToPath(import.meta.url)
);


const app = express();

const PORT = process.env.PORT || 4000;


const allowedOrigins =
    process.env.CORS_ORIGINS
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) || [];


app.use(
    cors({
        origin: allowedOrigins,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "token",
            "Authorization"
        ]
    })
);


app.use(express.json());


dbConnect();


app.use(
    "/api/food",
    foodRouter
);


app.use(
    "/images",
    express.static(path.join(backendDirectory, "uploads"))
);


app.use(
    "/api/user",
    userRouter
);


app.use(
    "/api/card",
    cartRouter
);


app.use(
    "/api/order",
    orderRouter
);


app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Food delivery API is running."
    });
});


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});
