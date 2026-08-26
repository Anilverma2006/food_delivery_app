// import express from "express"
// import authMiddlewere from "../middlewere/auth.js"
// import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder} from "../controllers/orderController.js"

// const orderRouter = express.Router();

// orderRouter.post("/place", authMiddlewere, placeOrder);
// orderRouter.post("/verify", verifyOrder)
// orderRouter.post("/userorders", authMiddlewere, userOrders);
// orderRouter.get("/list", listOrders);
// orderRouter.post("/status", updateStatus);

// export default orderRouter;



import express from "express";

import authMiddlewere from "../middlewere/auth.js";
import isAdmin from "../middlewere/isAdmin.js";

import {
    listOrders,
    placeOrder,
    updateStatus,
    userOrders,
    verifyOrder
} from "../controllers/orderController.js";


const orderRouter = express.Router();


// User routes
orderRouter.post(
    "/place",
    authMiddlewere,
    placeOrder
);

orderRouter.post(
    "/userorders",
    authMiddlewere,
    userOrders
);


// Payment verification
orderRouter.post(
    "/verify",
    verifyOrder
);


// Admin routes
orderRouter.get(
    "/list",
    authMiddlewere,
    isAdmin,
    listOrders
);

orderRouter.post(
    "/status",
    authMiddlewere,
    isAdmin,
    updateStatus
);


export default orderRouter;
