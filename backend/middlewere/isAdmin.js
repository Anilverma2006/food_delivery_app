import userModel from "../models/userModel.js";


const isAdmin = async (req, res, next) => {

    try {

        // auth.js must run before isAdmin
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


export default isAdmin;
