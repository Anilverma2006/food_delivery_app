import mongoose from "mongoose";


const dbConnect = async () => {

    try {

        await mongoose.connect(
            process.env.DATABASEURL
        );

        console.log(
            "Database connection successful."
        );

    } catch (error) {

        console.error(
            "Database connection failed:",
            error
        );

        process.exit(1);
    }
};


export {
    dbConnect
};