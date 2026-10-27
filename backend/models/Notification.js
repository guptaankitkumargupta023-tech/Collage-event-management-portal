const mongoose = require("mongoose");
module.exports = mongoose.model("Notification", new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  audience: { type: String, default: "All Students" }
}, { timestamps: true }));
