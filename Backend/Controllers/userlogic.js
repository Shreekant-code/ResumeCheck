import User from "../Schema/userschema.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import textract from "textract";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'

dotenv.config();
import { analyzeResumeATS } from "./Aimodel.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// console.log({
//   cloud: process.env.CLOUD_NAME,
//   key: process.env.CLOUD_API_KEY,
//   secret: process.env.CLOUD_API_SECRET
// });

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


const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};




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

 const accessToken = generateAccessToken(existuser);
    const refreshToken = generateRefreshToken(existuser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    await existuser.save();

  res.status(200).json({
  message: "Login successful",
  accessToken, 
  user: {
    id: existuser._id,
    name: existuser.name,
    email: existuser.email,
  },
});


        
    } catch (error) {
                res.status(500).json({message:error.message})
        
    }
}

export const Fileupload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { position } = req.body;
    if (!position) return res.status(400).json({ message: "Position is required" });

    const uploadToCloudinary = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "resumes" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });

    const uploadResult = await uploadToCloudinary(req.file.buffer);

  
    const extractedText = await new Promise((resolve, reject) => {
      textract.fromBufferWithMime(req.file.mimetype, req.file.buffer, (err, text) =>
        err ? reject(err) : resolve(text.trim())
      );
    });


    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Analyze resume using AI
    const aiData = await analyzeResumeATS(extractedText, position);

   
    const newResume = {
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      text: extractedText,
      email: aiData.email || null,
      phone: aiData.phone || null,
      position,
      skills: aiData.skills || [],
      experience: aiData.experience || "",
      education: aiData.education || "",
      strengths: aiData.strengths || [],
      weaknesses: aiData.weaknesses || [],
      atsScore: aiData.atsScore || 0,
      skillsMatchPercentage: aiData.skillsMatchPercentage || 0,
      weaknessPercentage: aiData.weaknessPercentage || 0,
      overallScore: aiData.overallScore || 0,
      suggestions: aiData.suggestions || [],
      youtubeLinks: aiData.youtubeLinks || [],
      analyzedAt: new Date(),
    };

    user.resumes.push(newResume);
    await user.save();

    res.status(200).json({
      message: "Resume uploaded and analyzed successfully",
      resume: newResume
    });

  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const Getdetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.resumes || user.resumes.length === 0)
      return res.status(404).json({ message: "No resumes uploaded yet" });

    const latestResume = user.resumes[user.resumes.length - 1];

   
    res.status(200).json({
      message: "Latest resume fetched successfully",
      resume: latestResume
    });

  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Server error" });
  }
};