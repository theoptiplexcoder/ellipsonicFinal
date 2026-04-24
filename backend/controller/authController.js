const express = require("express");
const router = express.Router();
const User =  require("../model/userSchema");
const bcrypt = require("bcryptjs");

const registerController = async(req,res,next) =>{
    try{
        const {firstName,middleName,lastName,email,phone,password,isAdmin} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists!"})
        }
        const newUser = new User({firstName,middleName,lastName,email,phone,password,isAdmin});
        await newUser.save();
        return res.status(201).json({message:"User registered successfully!",token:await newUser.generateToken(),userId:newUser._id,isAdmin:newUser.isAdmin})
    }
    catch(error){
        console.log(error);
        next(error);
    }
}

const loginController = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(user){
            const isMatch = await user.comparePassword(password);
            if(isMatch){
                return res.status(200).json({message:"User logged in successfully!",token:await user.generateToken(),userId:user._id,isAdmin:user.isAdmin})
            }
            else{
                return res.status(400).json({message:"Email ID or password is incorrect."})
            }
        }
        else{
            return res.status(400).json({message:"Email ID or password is incorrect."})
        }
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

module.exports = {registerController,loginController};