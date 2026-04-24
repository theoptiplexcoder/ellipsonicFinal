const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    response: {
      type: String,
      enum: ["Yes", "No"],
      default: "yes",
    },
  },
  { timestamps: true }
);

rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("RSVP", rsvpSchema);