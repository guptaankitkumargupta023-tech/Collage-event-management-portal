const router = require("express").Router();
const Notification = require("../models/Notification");
router.get("/", async (_req, res, next) => { try { res.json(await Notification.find().sort({ createdAt: -1 })); } catch (e) { next(e); } });
router.post("/", async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.message) return res.status(400).json({ message: "title and message are required" });
    res.status(201).json(await Notification.create(req.body));
  } catch (e) { next(e); }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const item = await Notification.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (e) { next(e); }
});
module.exports = router;
