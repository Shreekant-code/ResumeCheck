import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fileName: { type: String },
  fileUrl: { type: String },
  text: { type: String },
  email: { type: String },
  phone: { type: String },
  position: { type: String },                   // added
  skills: [String],
  experience: { type: String },
  education: { type: String },
  atsScore: { type: Number, default: 0 },
  skillsMatchPercentage: { type: Number, default: 0 }, // added
  weaknessPercentage: { type: Number, default: 0 },    // added
  overallScore: { type: Number, default: 0 },          // added
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  youtubeLinks: [String],                        // corrected name
  analyzedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: String },
  resumes: [resumeSchema]
}, { timestamps: true });

const User = mongoose.model("Userdata", userSchema);

export default User;
