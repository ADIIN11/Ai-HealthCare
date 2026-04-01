const userModel = require('../models/userModel.js')

const { OpenAI } = require("openai");

// Initialize OpenAI using the key from your .env file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create a new POST route for the chatbot
exports.askAi=async (req, res) => {
    try {
        const userMessage = req.body.message; // The message from the frontend

        // Call the OpenAI API securely
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // (Note: updated to a valid current model name)
            messages: [{ role: "user", content: userMessage }],
        });

        // Send the AI's response back to the frontend
        const aiReply = response.choices[0].message.content;
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ error: "Something went wrong with the AI." });
    }
}