import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";

const backendDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
);
const uploadsDirectory = path.join(backendDirectory, "uploads");

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

const hasValidEnvironmentValue = (value) => {
    const normalizedValue = value?.trim().toLowerCase();

    return Boolean(
        normalizedValue &&
        normalizedValue !== "undefined" &&
        normalizedValue !== "null"
    );
};

const isCloudinaryConfigured = () => (
    hasValidEnvironmentValue(process.env.CLOUDINARY_CLOUD_NAME) &&
    hasValidEnvironmentValue(process.env.CLOUDINARY_API_KEY) &&
    hasValidEnvironmentValue(process.env.CLOUDINARY_API_SECRET)
);

const saveImageLocally = async (file) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    await fs.promises.mkdir(uploadsDirectory, { recursive: true });
    await fs.promises.writeFile(
        path.join(uploadsDirectory, filename),
        file.buffer
    );

    return filename;
};


// Add food item
const addFood = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const { name, description, price, category } = req.body;

        if (!name || !description || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name, description, category and price are required"
            });
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a valid positive number"
            });
        }

        const usingCloudinary = isCloudinaryConfigured();
        const uploadedImage = usingCloudinary
            ? await uploadToCloudinary(req.file.buffer)
            : null;
        const localImage = usingCloudinary
            ? null
            : await saveImageLocally(req.file);

        const food = new foodModel({
            name,
            description,
            price: Number(price),
            category,

            image: usingCloudinary ? uploadedImage.secure_url : localImage,

            imagePublicId: usingCloudinary ? uploadedImage.public_id : ""
        });

        await food.save();

        res.status(201).json({
            success: true,
            message: "Food is Added"
        });

    } catch (error) {

        console.error("Food add error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Unable to add food."
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
                path.join(uploadsDirectory, food.image),
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
