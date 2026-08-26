// import userModel from "../models/userModel.js";
// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"
// import validator from "validator";


// const loginUser = async(req, res)=>{
//     const {email, password} = req.body;
    
//     const user = await userModel.findOne({email});
//     if(!user){
//         return res.json({success:false, message:"User Doesn't exits"})
//     }

//     const isMatch = await bcrypt.compare(password, user.password); 
//     if(!isMatch){
//         return res.json({success:false, message:"Password Invalid"})
//     }

//     const token = createToken(user._id);
//     res.json({success:true, token});

//     console.log(error);
//     res.json({success:false, message:"Error"});

// }

// const createToken = (id) =>{
//     return jwt.sign({id}, process.env.JWT_SECRET);
// }

// const registerUser = async (req, res) => {
//     const {name, email, password} = req.body;
//     try {

//         // checking if user already exists
//         const exists = await userModel.findOne({ email });

//         if (exists) {
//             return res.json({
//                 success: false,
//                 message: "User already exists"
//             });
//         }

//         // validating email format & strong password
//         if(!validator.isEmail(email)){
//             return res.json({
//                 success: false,
//                 message: "Please enter vaild mail"
//             });
//         }
//         if(password.length<8){
//             return res.json({
//                 success: false,
//                 message: "Please enter strong password"
//             });
//         }

//         // incript the password;
//         const salt = await bcrypt.genSalt(10);
//         const hashpassword =  await bcrypt.hash(password, salt);

//         const newUser = new userModel({
//             name:name,
//             email : email,
//             password:hashpassword
//         });

//         const user = await newUser.save();
//         const token = createToken(user._id);
//         res.json({success:true, token});

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"Error"});
//     }
// };

// export {loginUser, registerUser}






import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = createToken(user._id);

        return res.json({
            success: true,
            token: token,
            role: user.role
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: "Error"
        });
    }
};


const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET
    );
};


const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {

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
        const hashpassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashpassword

            // role intentionally not taken from req.body
            // default = "user"
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        return res.json({
            success: true,
            token: token,
            role: user.role
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: "Error"
        });
    }
};


const getUserDetails = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.body.userId)
            .select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: "Error getting user details"
        });
    }
};



export {
    loginUser,
    registerUser,
    getUserDetails
};
