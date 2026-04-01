const express = require("express")
const path = require("path")
const axios = require("axios")



require('dotenv').config({ quiet: true });

const {productsList,userList} = require("./data");

const mongoose= require("mongoose");
const { exit } = require("process");

mongoose.connect(process.env.MONGO_DB_URL).then(()=>console.log("MongoDB Connected Successfully :)")).catch(err=>{console.log("MongoDB Connection Error :",err)
})


