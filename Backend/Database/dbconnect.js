import mongoose, { Mongoose } from "mongoose";

const dbconnect=async()=>{
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" ✅ Database connection successful");
    } catch (error) {
        
        console.log(error.message);
    }
}

export default dbconnect;