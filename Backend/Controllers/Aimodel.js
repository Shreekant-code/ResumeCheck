import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const analyzeResumeATS = async (extractedText, position) => {
  const prompt = `
You are a professional resume analyzer. Analyze the following resume text for the desired position.

IMPORTANT: Return ONLY valid JSON. Do NOT include explanations, notes, quotes, or any text outside the JSON object. The output must be parseable with JSON.parse().

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
  "suggestions": [],
  "youtubelink": [],
  "email": null,
  "phone": null
}`;

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

    const jsonMatch = aiRaw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    }

    console.error("No JSON found in AI response");
    return {
      skills: [],
      experience: "",
      education: "",
      strengths: [],
      weaknesses: [],
      atsScore: 0,
      suggestions: [],
      youtubelink: [],
      email: null,
      phone: null,
    };
  } catch (err) {
    console.error("AI Error:", err.response?.data || err.message);
    return {
      skills: [],
      experience: "",
      education: "",
      strengths: [],
      weaknesses: [],
      atsScore: 0,
      suggestions: [],
      youtubelink: [],
      email: null,
      phone: null,
    };
  }
};
