import jwt from "jsonwebtoken";

const authMiddlewere = (req, res, next) => {

    try {

        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Login again."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;

        next();

    } catch (error) {

        console.log("Authentication error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

export default authMiddlewere;