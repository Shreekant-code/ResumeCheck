import User from "../Schema/userschema.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import textract from "textract";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import OpenAI from "openai";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
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
      refreshToken,
    });


        
    } catch (error) {
                res.status(500).json({message:error.message})
        
    }
}










export const Fileupload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload resume to Cloudinary
    const uploadToCloudinary = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "resumes" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    // Extract text using textract
    const extractedText = await new Promise((resolve, reject) => {
      textract.fromBufferWithMime(req.file.mimetype, req.file.buffer, (err, text) => {
        if (err) reject(err);
        else resolve(text);
      });
    });

  
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    
    const { position } = req.body;
    if (!position) return res.status(400).json({ message: "Position is required" });

   
    const prompt = `
You are a professional resume analyzer. Analyze the following resume text and provide:

1. Skills (comma-separated)
2. Experience summary
3. Education summary
4. Strengths
5. Weaknesses
6. ATS Score (0-100)
7. Suggest relevant online courses or YouTube videos to improve weaknesses

Resume Text:
${extractedText}

Desired Position: ${position}

Return the result in JSON format like this:
{
  "skills": [],
  "experience": "",
  "education": "",
  "strengths": [],
  "weaknesses": [],
  "atsScore": 0,
  "suggestions": []
}
`;

   
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Parse AI output
    let aiData = {};
    try {
      aiData = JSON.parse(aiResponse.choices[0].message.content);
    } catch (err) {
      console.error("Error parsing AI response:", err);
      aiData = {
        skills: [],
        experience: "",
        education: "",
        strengths: [],
        weaknesses: [],
        atsScore: 0,
        suggestions: [],
      };
    }

    // Save resume to user
    if (!user.resumes) user.resumes = [];
    user.resumes.push({
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      extractedText,
      email: null,
      phone: null,
      skills: aiData.skills || [],
      experience: aiData.experience || "",
      education: aiData.education || "",
      strengths: aiData.strengths || [],
      weaknesses: aiData.weaknesses || [],
      atsScore: aiData.atsScore || 0,
      suggestions: aiData.suggestions || [],
      position
    });

    await user.save();

    res.status(200).json({
      message: "Resume uploaded and analyzed successfully",
      resume: user.resumes[user.resumes.length - 1],
    });

  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const Getdetails = async (req, res) => {
  try {
    const userId = req.user.id;

    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    res.status(200).json({
      message: "User resumes fetched successfully",
      resumes: user.resumes || [],
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};