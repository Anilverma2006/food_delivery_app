import foodModel from "../models/foodModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "food_del",
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


// Add food item
const addFood = async (req, res) => {
    try {

        if (!req.file) {
            return res.json({
                success: false,
                message: "Image is required"
            });
        }

        // Upload image to Cloudinary
        const uploadedImage = await uploadToCloudinary(
            req.file.buffer
        );

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,

            // Cloudinary image URL
            image: uploadedImage.secure_url,

            // Cloudinary public ID
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
            message: "Something is went wrong"
        });
    }
};


// All food list
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
            message: "Error is Show in all food list"
        });
    }
};


// Remove food
const removeFood = async (req, res) => {

    try {

        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.json({
                success: false,
                message: "Food not found"
            });
        }

        // New Cloudinary image
        if (food.imagePublicId) {

            await cloudinary.uploader.destroy(
                food.imagePublicId,
                {
                    resource_type: "image",
                    invalidate: true
                }
            );

        }
        // Old local image
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
            message: "Error is Show in food remove"
        });
    }
};


export {
    addFood,
    listFood,
    removeFood
};