const router = require("express").Router();
const Registration = require("../models/Registration");
const Event = require("../models/Event");

router.get("/", async (_req, res, next) => {
  try { res.json(await Registration.find().populate("event", "title date venue").sort({ createdAt: -1 })); } catch (e) { next(e); }
});
router.post("/", async (req, res, next) => {
  try {
    const { event, studentName, email, studentId } = req.body;
    if (!event || !studentName || !email) return res.status(400).json({ message: "event, studentName and email are required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Please provide a valid email" });
    const foundEvent = await Event.findById(event);
    if (!foundEvent) return res.status(404).json({ message: "Event not found" });
    const duplicate = await Registration.findOne({ event, email: email.toLowerCase() });
    if (duplicate) return res.status(409).json({ message: "This email is already registered for this event" });
    res.status(201).json(await Registration.create({ event, studentName, email, studentId }));
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Already registered" });
    next(e);
  }
});
module.exports = router;
