const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/analyze", async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Compare this resume: "${resumeText}" with this job description: "${jobDescription}". Give a match percentage (0-100), key strengths, and 3 key missing skills.`,
    });
    res.json({ result: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    res
      .status(500)
      .json({ error: "AI Analysis Failed", details: error.message });
  }
});

module.exports = router;
