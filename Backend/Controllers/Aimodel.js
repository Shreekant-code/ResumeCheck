import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Analyze a resume using AI and return structured JSON with ATS metrics.
 * @param {string} extractedText - Text content of the resume.
 * @param {string} position - Desired job position.
 * @returns {Object} Resume analysis results including ATS score, skill match, weaknesses, etc.
 */
export const analyzeResumeATS = async (extractedText, position) => {
  const prompt = `
You are a professional resume analyzer. Analyze the following resume text for the desired position.

IMPORTANT: Return ONLY valid JSON. Do NOT include explanations, notes, or quotes. The output must be parseable with JSON.parse().

Resume Text:
${extractedText}

Desired Position:
${position}

Return JSON in exactly this format:
{
  "skills": [],
  "experience": "",
  "education": "",
  "strengths": [],
  "weaknesses": [],
  "atsScore": 0,
  "skillsMatchPercentage": 0,
  "weaknessPercentage": 0,
  "overallScore": 0,
  "suggestions": [],
  "youtubeLinks": [],
  "email": null,
  "phone": null
}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3.1",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiRaw = response.data.choices[0].message.content;

    // Extract JSON from AI response
    const jsonMatch = aiRaw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);

        
        return {
          skills: parsed.skills || [],
          experience: parsed.experience || "",
          education: parsed.education || "",
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          atsScore: parsed.atsScore || 0,
          skillsMatchPercentage: parsed.skillsMatchPercentage || 0,
          weaknessPercentage: parsed.weaknessPercentage || 0,
          overallScore: parsed.overallScore || 0,
          suggestions: parsed.suggestions || [],
          youtubeLinks: parsed.youtubeLinks || [],
          email: parsed.email || null,
          phone: parsed.phone || null,
        };
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    }

    console.error("No JSON found in AI response");
    return getEmptyResumeAnalysis();
  } catch (err) {
    console.error("AI Error:", err.response?.data || err.message);
    return getEmptyResumeAnalysis();
  }
};


const getEmptyResumeAnalysis = () => ({
  skills: [],
  experience: "",
  education: "",
  strengths: [],
  weaknesses: [],
  atsScore: 0,
  skillsMatchPercentage: 0,
  weaknessPercentage: 0,
  overallScore: 0,
  suggestions: [],
  youtubeLinks: [],
  email: null,
  phone: null,
});
