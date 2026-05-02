const express = require("express");
const { listDepots, scheduleHandler } = require("../handler/schedulerHandler");
const { Log } = require("../../../logging middleware/logger");

const router = express.Router();

router.use(async (req, _res, next) => {
  await Log(
    "backend",
    "info",
    "route",
    `Incoming ${req.method} ${req.originalUrl}`
  );
  next();
});

router.get("/depots", listDepots);

router.post("/schedule", scheduleHandler);

module.exports = router;
