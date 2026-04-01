const express = require("express");
const router = express.Router();
const path = require('path');

// Import your controller function
const { askAi } = require('../controllers/chatbotController.js');

// GET route to serve the HTML page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/chatbot.html"));
});

// POST route for the AI logic (Changed from app.post to router.post!)
router.post("/Ask", askAi);

module.exports = router;