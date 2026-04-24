const Event = require("../model/eventSchema");

const viewAllEventsController = async(req,res,next)=>{
    try{
        const events = await Event.find();
        res.status(200).json({events});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const viewSingleEventController = async(req,res,next)=>{
    try{
        const event = await Event.findById(req.params.id);
        res.status(200).json({event});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const updateEventController = async(req,res,next)=>{
    try{
        const event = await Event.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json({event});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const deleteEventController = async(req,res,next)=>{
    try{
        const event = await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({event});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const createEventController = async(req,res,next)=>{
    try{
        const {title,description,location,date,createdBy,capacity} = req.body;
        const event = await new Event({title,description,location,date,createdBy,capacity});
        await event.save();
        res.status(201).json({message:"Event created successfully!",event});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}


module.exports = {viewAllEventsController,viewSingleEventController,updateEventController,deleteEventController,createEventController};