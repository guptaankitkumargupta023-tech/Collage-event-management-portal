const mongoose = require("mongoose");
module.exports = mongoose.model("Result", new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  studentName: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  remarks: { type: String, default: "" }
}, { timestamps: true }));
