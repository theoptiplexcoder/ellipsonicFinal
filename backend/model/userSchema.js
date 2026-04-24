const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        max:20,
        min:3,
        trim:true
    },
    middleName:{
        type:String,
        max:20,
        min:3,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        max:20,
        min:3,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

userSchema.pre("save",async function(next){
    const user = this;
    if(!user.isModified("password")){
        next();
    }
    try{
        const hash_password = await bcrypt.hash(user.password,10);
        user.password = hash_password;
    }
    catch(error){
        next(error);
    }
})

userSchema.methods.generateToken = async function () {
    try{
        return jwt.sign({
            userId: this._id,
            email:this.email,
            isAdmin:this.isAdmin,
        },process.env.JWT_SECRET,{expiresIn:"10d"})
    }
    catch(err){
        console.error(err);
    }
}

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password);
}

const User = new mongoose.model("User",userSchema);

module.exports = User;