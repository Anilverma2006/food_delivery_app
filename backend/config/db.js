import mongoose from "mongoose";
import dotenv from "dotenv"

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASEURL)
    .then(()=>{console.log("bd connection is Successful")})
    .catch((e)=>{
        console.log("error is show")
        console.error(e);
        process.exit(1);
    }); 
}
export { dbConnect }  

