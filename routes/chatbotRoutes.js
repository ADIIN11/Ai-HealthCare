const express =require ("express")
const router = express.Router()

const path = require('path')


router.get("/",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/chatbot.html"))
})

module.exports = router;