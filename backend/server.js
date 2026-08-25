import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {dbConnect} from "./config/db.js"
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cardRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// middlerwayer
app.use(express.json());
app.use(cors());

// db se connnet kiya
dbConnect();

// api endpoint
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/card", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) =>{
    res.send(`<h1> this is HOMEPAGE</h1>`)
});

app.listen(PORT, ()=>{
    console.log(`app is started at port no. ${PORT}`)
});