const UserModel = require('../models/userAuthModel');

const jwt = require("jsonwebtoken")
exports.register = async(req , res) => {
    try{
const data = req.body
const {name, email, password} = data

// Simple validation
        if(!name ||!email ||!password){
            return res.status(400).json({status:false, message:'Please enter all fields'});
        }

        // Check for existing user
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(400).json({status:false, message:"User already exists"});
        }
        
        // Create a new user
        const newUser = new UserModel({name, email, password});
        await newUser.save();

        res.status(200).json({status:true, message:"User created successfully", data:newUser});

    }catch(err){
        return res.status(500).json({status:false, message:err.message});
    }
}


exports.login = async(req , res) => {
    try{
        const {email, password} = req.body;
        
        // Simple validation
        if(!email ||!password){
            return res.status(400).json({status:false, message:'Please enter all fields'});
        }
        
        // Check for existing user
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({status:false, message:"User not found"});
        }
        
        // Validate password
      const checkUser = await UserModel.findOne({email:email, password:password});
        
      if(!checkUser){
        return res.status(404).json({status:false, message:"user not found"});
      }
        const token =  jwt.sign({_id: checkUser.id, email:checkUser.email}, process.env.JWT_SECRET_KEY)
      
        res.status(200).json({status:true , message:"login successful", token:token})
    }catch(err){
        return res.status(500).json({status:false, message:err.message});
    }
}


exports.getAllUsers = async (req, res) => {
    try{
const userId = req.user._id

const allUsers = await UserModel.find({ _id: { $ne: userId } });

res.status(200).json({status:true, message:"All users", data:allUsers});
    }catch(err){
        res.status(500).json({status:false, message:err.message});
    }
}