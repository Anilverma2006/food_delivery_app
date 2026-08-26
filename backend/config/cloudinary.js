import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// This module is evaluated before server.js runs its body in ESM.
// Load the environment here so Cloudinary receives its configuration.
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
