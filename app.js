
const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = express();
const path = require("path");
app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

app.use(cors())

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.get("/",async(req,res)=>{
  try{
  res.sendFile(path.join(__dirname, "./public/index.html"))
  }catch(err){
    console.log(err.message);
    res.status(500).json({status:false ,message:err.message})
  } 
  })  
app.get("/test", async (req, res)=>{
  try{

    res.status(200).json({status:true , data:"your app is working very nice"})
  }catch(err){
    console.log(err.message);
    res.status(500).json({status:false ,message:err.message})
  }
})

const userRoute = require("./routing/userRouting")
app.use("/", userRoute)

module.exports = app;
 