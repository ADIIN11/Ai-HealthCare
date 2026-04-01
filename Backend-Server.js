const express = require("express")
const path = require("path")
const axios = require("axios")



require('dotenv').config({ quiet: true });


const mongoose= require("mongoose");
const { exit } = require("process");

mongoose.connect(process.env.MONGO_DB_URL).then(()=>console.log("MongoDB Connected Successfully :)")).catch(err=>{console.log("MongoDB Connection Error :",err)
})



// const authRoutes=require("./routes/authRoutes")
const commonRoutes=require("./routes/commonRoutes")
// const profileRoutes=require("./routes/profileRoutes")
// const categoryRoutes=require("./routes/productRoutes")
// const storeRoutes=require("./routes/storeRoutes")

const app = express();

app.use(express.json())

const PORT = process.env.PORT

app.use("",commonRoutes)
