const router = require("express").Router();
const Result = require("../models/Result");
const Event = require("../models/Event");
router.get("/", async (_req, res, next) => { try { res.json(await Result.find().populate("event", "title date").sort({ createdAt: -1 })); } catch (e) { next(e); } });
router.post("/", async (req, res, next) => {
  try {
    const { event, studentName, position } = req.body;
    if (!event || !studentName || !position) return res.status(400).json({ message: "event, studentName and position are required" });
    if (!await Event.findById(event)) return res.status(404).json({ message: "Event not found" });
    res.status(201).json(await Result.create(req.body));
  } catch (e) { next(e); }
});
module.exports = router;
