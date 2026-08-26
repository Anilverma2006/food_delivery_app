import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET
    );
};


// LOGIN
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User Doesn't exist"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Password Invalid"
            });
        }

        const token = createToken(user._id);

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user"
            }
        });

    } catch (error) {

        console.log(error);

        return res.json({
            success: false,
            message: "Error"
        });
    }
};


// REGISTER
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }


        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter valid mail"
            });
        }


        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter strong password"
            });
        }


        const salt = await bcrypt.genSalt(10);

        const hashpassword = await bcrypt.hash(
            password,
            salt
        );


        const newUser = new userModel({
            name,
            email,
            password: hashpassword,
            role: "user"
        });


        const user = await newUser.save();

        const token = createToken(user._id);


        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        return res.json({
            success: false,
            message: "Error"
        });
    }
};


// GET CURRENT USER
const getUser = async (req, res) => {

    try {

        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const user = await userModel
            .findById(decoded.id)
            .select("-password");


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }


        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user"
            }
        });

    } catch (error) {

        console.log("Get User Error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


export {
    loginUser,
    registerUser,
    getUser
};