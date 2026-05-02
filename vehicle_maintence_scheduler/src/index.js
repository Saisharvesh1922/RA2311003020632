const express = require("express");
const { Log } = require("../../logging middleware/logger");
const schedulerRoutes = require("./route/schedulerRoutes");
const { PORT } = require("./config");

const app = express();

app.use(express.json());

app.use("/", schedulerRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "vehicle-scheduling" });
});

app.use(async (req, res) => {
  await Log(
    "backend",
    "warn",
    "handler",
    `404 Not Found: ${req.method} ${req.originalUrl}`
  );
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(async (err, req, res, _next) => {
  await Log(
    "backend",
    "fatal",
    "handler",
    `Unhandled exception on ${req.method} ${req.originalUrl}: ${err.message}`
  );
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, async () => {
  await Log(
    "backend",
    "info",
    "handler",
    `Vehicle Scheduling microservice started on port ${PORT}`
  );
  console.log(`\n Vehicle Scheduling Service running on http://localhost:${PORT}`);
  console.log(`   POST /schedule   — optimise vehicle maintenance schedule`);
  console.log(`   GET  /depots     — list depots with mechanic hours`);
  console.log(`   GET  /health     — health check\n`);
});

module.exports = app;
