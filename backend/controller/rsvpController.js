const RSVP = require("../model/rsvpSchema");
const Event = require("../model/eventSchema");

const createRSVPController = async(req,res,next)=>{
    try{
        const {eventId, response} = req.body;
        const userId = req.user.userId;
        
        // Check if event exists
        const event = await Event.findById(eventId);
        if(!event){
            return res.status(404).json({message:"Event not found"});
        }
        
        // Check if user already RSVP'd
        const existingRSVP = await RSVP.findOne({user:userId, event:eventId});
        if(existingRSVP){
            return res.status(400).json({message:"You have already RSVP'd to this event"});
        }
        
        // Create RSVP
        const rsvp = await new RSVP({
            user:userId,
            event:eventId,
            response:response || "Yes"
        });
        await rsvp.save();
        
        // Increment registration count only if response is "Yes"
        if(response === "Yes" || !response){
            await Event.findByIdAndUpdate(eventId, {$inc: {registrationCount: 1}});
        }
        
        res.status(201).json({message:"RSVP created successfully!", rsvp});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const getRSVPStatusController = async(req,res,next)=>{
    try{
        const {eventId} = req.query;
        const userId = req.user.userId;
        const rsvp = await RSVP.findOne({user:userId, event:eventId});
        res.status(200).json({rsvp});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const cancelRSVPController = async(req,res,next)=>{
    try{
        const {rsvpId} = req.params;
        const rsvp = await RSVP.findByIdAndDelete(rsvpId);
        
        if(!rsvp){
            return res.status(404).json({message:"RSVP not found"});
        }
        
        // Decrement registration count only if response was "Yes"
        if(rsvp.response === "Yes"){
            await Event.findByIdAndUpdate(rsvp.event, {$inc: {registrationCount: -1}});
        }
        
        res.status(200).json({message:"RSVP cancelled successfully!"});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

module.exports = {createRSVPController, getRSVPStatusController, cancelRSVPController};
