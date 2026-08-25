import userModel from '../models/userModel.js'

// add item from user card
const addToCart = async(req, res) =>{
    try {
        let userData = await userModel.findOne({
            _id: req.body.userId
        });

        let cartData = await userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } 
        else{
            cartData[req.body.itemId]+=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true, message:"Added to card"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// remove item from user card
const removeFromCart = async(req, res) =>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        if (cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        else if(cartData[req.body.itemId] === 0) {
            delete cartData[req.body.itemId];
        }

        await userModel.findByIdAndUpdate(req.body.userId,{ cartData });
        res.json({
            success: true,
            message: "Removed From Cart"
        });

    } 
    catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        });
    }
}


// fetch user card data
const getCart = async (req, res) => {
    try {
        console.log("userId:", req.body.userId);

        let userData = await userModel.findById(req.body.userId);

        console.log("userData:", userData);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = userData.cartData;

        res.json({
            success: true,
            cartData
        });

    } catch (error) {
        console.log("GET CART ERROR:", error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};
export {addToCart, removeFromCart, getCart}