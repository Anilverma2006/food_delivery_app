// import express from "express"
// import { addFood , listFood, removeFood } from "../controllers/foodcontroller.js"

// import multer from "multer"

// const foodRouter = express.Router();

// const storage = multer.diskStorage({
//     destination:"uploads",
//     filename:(req, file, cb)=>{
//         return cb(null, `${Date.now()}${file.originalname}`)
//     }

// })

// const upload = multer({storage:storage})

// // routes
// foodRouter.post("/add",upload.single("image"), addFood);
// foodRouter.get("/list", listFood);
// foodRouter.post("/remove", removeFood);

// export default foodRouter;
 

import express from "express";
import {
    addFood,
    listFood,
    removeFood
} from "../controllers/foodcontroller.js";

import multer from "multer";

import authMiddlewere from "../middlewere/auth.js";
import isAdmin from "../middlewere/isAdmin.js";


const foodRouter = express.Router();


const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


// Public
foodRouter.get("/list", listFood);


// Admin only
foodRouter.post(
    "/add",
    authMiddlewere,
    isAdmin,
    upload.single("image"),
    addFood
);

foodRouter.post(
    "/remove",
    authMiddlewere,
    isAdmin,
    removeFood
);


export default foodRouter;
