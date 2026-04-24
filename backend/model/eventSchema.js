// models/Event.js
const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    capacity: {
      type: Number,
      default: null, // optional limit
    },
    registrationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

eventSchema.index(
  { createdBy: 1, title: 1, date: 1, location: 1 },
  { unique: true }
);

module.exports = mongoose.model("Event", eventSchema);