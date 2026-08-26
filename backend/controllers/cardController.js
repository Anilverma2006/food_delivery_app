import userModel from "../models/userModel.js";

// ADD TO CART
const addToCart = async (req, res) => {
    try {

        const userData = await userModel.findById(
            req.userId
        );

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(
            req.userId,
            { cartData }
        );

        res.json({
            success: true,
            message: "Added to cart"
        });

    } catch (error) {

        console.log("ADD CART ERROR:", error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// REMOVE FROM CART
const removeFromCart = async (req, res) => {
    try {

        const userData = await userModel.findById(
            req.userId
        );

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const cartData = userData.cartData || {};

        if (cartData[req.body.itemId] > 0) {

            cartData[req.body.itemId] -= 1;

        } else if (
            cartData[req.body.itemId] === 0
        ) {

            delete cartData[req.body.itemId];
        }

        await userModel.findByIdAndUpdate(
            req.userId,
            { cartData }
        );

        res.json({
            success: true,
            message: "Removed From Cart"
        });

    } catch (error) {

        console.log(
            "REMOVE CART ERROR:",
            error
        );

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// GET CART
const getCart = async (req, res) => {
    try {

        const userData = await userModel.findById(
            req.userId
        );

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const cartData =
            userData.cartData || {};

        res.json({
            success: true,
            cartData
        });

    } catch (error) {

        console.log(
            "GET CART ERROR:",
            error
        );

        res.json({
            success: false,
            message: "Error"
        });
    }
};

export {
    addToCart,
    removeFromCart,
    getCart
};