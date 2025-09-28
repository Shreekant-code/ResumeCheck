import User from "../Schema/userschema.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
// import pdfParse from "pdf-parse";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log({
  cloud: process.env.CLOUD_NAME,
  key: process.env.CLOUD_API_KEY,
  secret: process.env.CLOUD_API_SECRET
});

export const RegisterLogic= async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            res.status(401).json({message:"All the fields are requird"});

        }
       
  const emailexist= await User.findOne({email});
  if(emailexist){
     res.status(401).json({message:"Email already in use"});
  }

  const hashedpassword= await bcrypt.hash(password, 10);

   const newUser = new User({
      name,
      email,
      password:hashedpassword
    });

   await newUser.save();

 res.status(201).json({
      message: "Registration successful",
      user: { name: newUser.name, email: newUser.email,password:newUser.password }
    });

        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }

}




export const Login=async(req,res)=>{
    try {

const {email,password}=req.body;

const existuser=await User.findOne({email});
if(!existuser){
    res.status(400).json({message:"Email or Password is Invalid"})
}

const MatchPassword=await bcrypt.compare(password,existuser.password);

if(!MatchPassword){
    
 res.status(400).json({message:"Email or Password is Invalid"})

}

 res.status(200).json({message:"Login successful",email,password})

        
    } catch (error) {
                res.status(500).json({message:error.message})
        
    }
}

export const Fileupload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // let extractedText = "";
    // if (req.file.mimetype === "application/pdf") {
    const uploadToCloudinary = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "resumes" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });

    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(req.file.buffer);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

   
    User.resume = {
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      uploadedAt: new Date(),
    };
    await User.save();

    res.status(200).json({
      message: "File uploaded successfully",
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};