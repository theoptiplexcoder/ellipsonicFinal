const mongoose = require("mongoose");
const connectDB = async()=>{
const URI = process.env.MONGODB_URI;
    try{
        await mongoose.connect(URI);
        console.log("Database connected successfully!");
    }
    catch(err){
        console.log(err);
        process.exit(0);
    }
}

module.exports = connectDB;