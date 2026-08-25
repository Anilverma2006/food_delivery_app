import { error } from "console";
import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();

        res.json({
            success: true,
            message: "Food is Added"
        });
    }
    catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Something is went wrong"
        });
    }
};

// all food list
const listFood = async (req, res)=>{
    try{
        const food = await foodModel.find({});
        res.json({success:true, data:food});
    }
    catch(error){
        console.log(error)
        res.json({success:false, message:"Error is Show in all food list "})
    }
}
 
// remove food
const removeFood = async (req, res) =>{
    try{
        const food = await foodModel.findById(req.body.id);  
        fs.unlink(`uploads/${food.image}`, ()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"food deleted"});
    }
    catch(e){
        console.log(error)
        res.json({success:false, message:"Error is Show in food remove "})
    }
}

export { addFood, listFood, removeFood};