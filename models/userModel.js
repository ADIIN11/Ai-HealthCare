const mongoose = require('mongoose')



const userSchema=new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    bloodGroup: String,
    createdAt: String,
    verification: Boolean,
    profileImg:String,
    profileImgPubId:String,
    address: Object,
    reviewsWritten:Array,
    role: String,
    id: Number,
    chats:Array,
    vitals:Array,
    reminders:Array
  },{ versionKey: false })
  
 module.exports = mongoose.models.User ||mongoose.model("User",userSchema,"users")
