const express =require ("express")
const router = express.Router()

const path = require('path')

const {
  askAi
} = require('../controllers/authController.js')


router.get("/",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/calendar.html"))
})

module.exports = router;