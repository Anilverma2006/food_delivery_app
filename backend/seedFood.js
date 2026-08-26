// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import fs from "fs";
// import foodModel from "./models/foodModel.js";

// dotenv.config();

// const seedFood = async () => {
//     try {
//         await mongoose.connect(process.env.DATABASEURL);

//         console.log("✅ MongoDB connected");

//         const filePath = "./seed/food_data.json";

//         const fileData = fs.readFileSync(filePath, "utf-8");

//         console.log("📄 JSON file size:", fileData.length);

//         const foodData = JSON.parse(fileData);

//         console.log("🍔 Total food items:", foodData.length);

//         await foodModel.insertMany(foodData);

//         console.log("✅ Food data inserted successfully");

//         await mongoose.connection.close();

//     } catch (error) {
//         console.log("❌ Error:", error);
//     }
// };

// seedFood();




import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

import foodModel from "./models/foodModel.js";

dotenv.config();

const seedFood = async () => {
    try {
        await mongoose.connect(process.env.DATABASEURL);

        console.log("✅ MongoDB connected");

        // JSON file read
        const foodData = JSON.parse(
            fs.readFileSync(
                "./seed/food_data.json",
                "utf-8"
            )
        );

        console.log("📦 New food data:", foodData.length);

        // STEP 1: Purana saara food data delete
        await foodModel.deleteMany({});

        console.log("🗑️ Old food data deleted");

        // STEP 2: Naya data insert
        await foodModel.insertMany(foodData);

        console.log("✅ New food data inserted successfully");

        await mongoose.connection.close();

    } catch (error) {
        console.log("❌ Error:", error);
    }
};

seedFood();