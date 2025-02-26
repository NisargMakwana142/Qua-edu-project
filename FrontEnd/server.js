require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("⚠️ GEMINI_API_KEY is missing in .env file!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Store chat history for multi-turn conversations
const chatHistory = [];

// Predefined responses for quick replies
const predefinedResponses = {
  "profile": "You can access the profile by clicking on the profile tab.",
  "light theme": "Click on the ☀️ on the top right to change to light theme.",
  "dark theme": "Click on the 🌙 on the top right to change to dark theme.",
};

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase().trim();
    console.log("📩 User Message:", userMessage);

    // Check if a predefined response exists
    if (predefinedResponses[userMessage]) {
      console.log("💬 Responding with predefined answer.");
      return res.json({ reply: predefinedResponses[userMessage] });
    }

    console.log("🤖 Sending request to Gemini API...");

    // Add user message to chat history
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

    // Send message to Gemini AI
    const chatSession = model.startChat({ history: chatHistory });
    const result = await chatSession.sendMessage(userMessage);
    const aiResponse = result.response.text();

    if (!aiResponse) throw new Error("Empty response from AI");

    console.log("💬 AI Response:", aiResponse);

    // Add AI response to history
    chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("❌ Error in /chat API:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
