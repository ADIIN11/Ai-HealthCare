const express =require ("express")
const router = express.Router()
const {
  userSingUp,
  userSingIn
} = require('../controllers/authController.js')

const path = require('path')


router.get("/Sign_Up", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"))
})


router.post("/Sign_Up",userSingUp)




router.get("/Sign_In", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"))
})

router.post("/Sign_In", userSingIn)


module.exports = router