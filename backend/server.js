require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const resultRoutes = require("./routes/resultRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok", message: "College Event Portal API is running" }));
app.use("/api/events",
require("./routes/eventRoutes"));
app.use("/api/registrations", registrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/certificates", certificateRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_event_portal")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Backend server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
