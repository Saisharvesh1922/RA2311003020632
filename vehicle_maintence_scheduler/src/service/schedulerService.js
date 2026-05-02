const { fetchDepots, fetchVehicles } = require("../repository/externalApi");
const { knapsack } = require("../domain/knapsack");
const { Log } = require("../../../logging middleware/logger");

async function getDepots() {
  await Log("backend", "info", "service", "getDepots service called");
  try {
    const depots = await fetchDepots();
    await Log(
      "backend",
      "info",
      "service",
      `getDepots service returning ${depots.length} depots`
    );
    return depots;
  } catch (err) {
    await Log(
      "backend",
      "error",
      "service",
      `getDepots service failed: ${err.message}`
    );
    throw err;
  }
}

/**
 * @param {number|null} depotId  
 */
async function scheduleVehicles(depotId) {
  await Log("backend", "info", "service", `scheduleVehicles called for depotId=${depotId ?? "all"}`);

  let vehicles, depots;

  try {
    [vehicles, depots] = await Promise.all([fetchVehicles(), fetchDepots()]);
  } catch (err) {
    await Log(
      "backend",
      "error",
      "service",
      `scheduleVehicles — data fetch failed: ${err.message}`
    );
    throw err;
  }


  let budget;
  let chosenDepot;

  if (depotId !== null && depotId !== undefined) {
    chosenDepot = depots.find((d) => d.ID === Number(depotId));
    if (!chosenDepot) {
      const msg = `Depot with ID ${depotId} not found`;
      await Log("backend", "warn", "service", msg);
      const err = new Error(msg);
      err.statusCode = 404;
      throw err;
    }
    budget = chosenDepot.MechanicHours;
  } else {

    budget = depots.reduce((sum, d) => sum + d.MechanicHours, 0);
    chosenDepot = null;
  }

  await Log(
    "backend",
    "info",
    "service",
    `scheduleVehicles — budget=${budget} hours, vehicles to evaluate=${vehicles.length}`
  );

  const result = knapsack(vehicles, budget);

  await Log(
    "backend",
    "info",
    "service",
    `scheduleVehicles — scheduled ${result.scheduled.length} vehicles, totalImpact=${result.totalImpact}, hoursUsed=${result.totalDuration}/${budget}`
  );

  return {
    depot: chosenDepot,
    budgetHours: budget,
    hoursUsed: result.totalDuration,
    hoursRemaining: budget - result.totalDuration,
    totalImpactScore: result.totalImpact,
    scheduledCount: result.scheduled.length,
    scheduledVehicles: result.scheduled,
  };
}

module.exports = { getDepots, scheduleVehicles };
