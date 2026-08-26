import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = createToken(user._id);

    const role = user.role || "user";

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        cartData: user.cartData,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// --------------------------------------------------
// REGISTER
// --------------------------------------------------

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    const normalizedName = name?.trim();

    const exists = await userModel.findOne({
      email: normalizedEmail,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email.",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: normalizedName,
      email: normalizedEmail,
      password: hashPassword,
      role: "user",
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cartData: user.cartData,
      },
    });
  } catch (error) {
    console.log("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// --------------------------------------------------
// GET CURRENT USER
// --------------------------------------------------

const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const role = user.role || "user";

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get user details.",
    });
  }
};

export { loginUser, registerUser, getUserDetails };
