const router = require("express").Router();
const Event = require("../models/Event");

router.get("/", async (_req, res, next) => {
  try { res.json(await Event.find().sort({ date: 1 })); } catch (e) { next(e); }
});
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (e) { next(e); }
});
router.post("/", async (req, res, next) => {
  try {
    const { title, date, venue } = req.body;
    if (!title || !date || !venue) return res.status(400).json({ message: "title, date and venue are required" });
    res.status(201).json(await Event.create(req.body));
  } catch (e) { next(e); }
});
router.put("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (e) { next(e); }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (e) { next(e); }
});
module.exports = router;
