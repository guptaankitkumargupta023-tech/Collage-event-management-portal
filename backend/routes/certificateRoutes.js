const router = require("express").Router();
const PDFDocument = require("pdfkit");
const Registration = require("../models/Registration");

router.get("/:registrationId", async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.registrationId).populate("event");
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="participation-certificate.pdf"');
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
    doc.pipe(res);
    doc.fontSize(28).text("CERTIFICATE OF PARTICIPATION", { align: "center" });
    doc.moveDown(2).fontSize(18).text("This certificate is proudly presented to", { align: "center" });
    doc.moveDown().fontSize(30).text(registration.studentName, { align: "center", underline: true });
    doc.moveDown().fontSize(16).text(`for participating in ${registration.event ? registration.event.title : "College Event"}`, { align: "center" });
    doc.moveDown(2).fontSize(12).text("College Event Management Portal", { align: "center" });
    doc.end();
  } catch (e) { next(e); }
});
module.exports = router;
