import mongoose, { Mongoose } from "mongoose";

const dbconnect=async()=>{
    try {
        
        await mongoose.connect('mongodb://localhost:27017/resume');
        console.log(" ✅ Database connection successful");
    } catch (error) {
        
        console.log(error.message);
    }
}

export default dbconnect;