const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: { type: String, default: "College Event" },
  date: { type: Date, required: true },
  venue: { type: String, required: true, trim: true },
  capacity: { type: Number, default: 100, min: 1 },
  organizer: { type: String, default: "College Administration" }
}, { timestamps: true });
module.exports = mongoose.model("Event", eventSchema);
