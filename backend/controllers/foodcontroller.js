import foodModel from "../models/foodModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

// upload image to cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "food_delivery",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
};


// add food item
const addFood = async (req, res) => {
    try {

        if (!req.file) {
            return res.json({
                success: false,
                message: "Image is required"
            });
        }

        // upload image to cloudinary
        const uploadedImage = await uploadToCloudinary(
            req.file.buffer
        );

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,

            // Cloudinary URL
            image: uploadedImage.secure_url,

            // Cloudinary public id
            imagePublicId: uploadedImage.public_id
        });

        await food.save();

        res.json({
            success: true,
            message: "Food is Added"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Something went wrong"
        });
    }
};


// all food list
const listFood = async (req, res) => {

    try {

        const food = await foodModel.find({});

        res.json({
            success: true,
            data: food
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Error is shown in all food list"
        });
    }
};


// remove food
const removeFood = async (req, res) => {

    try {

        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.json({
                success: false,
                message: "Food not found"
            });
        }

        // --------------------------------
        // NEW FOOD -> DELETE FROM CLOUDINARY
        // --------------------------------

        if (food.imagePublicId) {

            await cloudinary.uploader.destroy(
                food.imagePublicId,
                {
                    invalidate: true
                }
            );

        }

        // --------------------------------
        // OLD FOOD -> DELETE LOCAL IMAGE
        // --------------------------------

        else if (food.image && !food.image.startsWith("http")) {

            fs.unlink(
                `uploads/${food.image}`,
                () => {}
            );

        }

        await foodModel.findByIdAndDelete(req.body.id);

        res.json({
            success: true,
            message: "food deleted"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Error is shown in food remove"
        });
    }
};


export {
    addFood,
    listFood,
    removeFood
};