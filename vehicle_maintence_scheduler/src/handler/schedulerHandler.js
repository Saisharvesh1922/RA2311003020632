const { getDepots, scheduleVehicles } = require("../service/schedulerService");
const { Log } = require("../../../logging middleware/logger");


async function listDepots(req, res) {
  await Log("backend", "info", "handler", "GET /depots — request received");
  try {
    const depots = await getDepots();
    await Log("backend", "info", "handler", `GET /depots — responding with ${depots.length} depots`);
    return res.status(200).json({
      success: true,
      count: depots.length,
      depots,
    });
  } catch (err) {
    await Log("backend", "error", "handler", `GET /depots — unhandled error: ${err.message}`);
    return res.status(502).json({
      success: false,
      error: "Failed to fetch depots from upstream API",
      details: err.message,
    });
  }
}


async function scheduleHandler(req, res) {
  const { depotId } = req.body || {};
  await Log(
    "backend",
    "info",
    "handler",
    `POST /schedule — request received, depotId=${depotId ?? "not specified"}`
  );

  try {
    const result = await scheduleVehicles(depotId);
    await Log(
      "backend",
      "info",
      "handler",
      `POST /schedule — success, ${result.scheduledCount} vehicles scheduled`
    );
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    const status = err.statusCode || 502;
    await Log("backend", "error", "handler", `POST /schedule — error: ${err.message}`);
    return res.status(status).json({
      success: false,
      error: err.message || "Failed to compute schedule",
    });
  }
}

module.exports = { listDepots, scheduleHandler };
