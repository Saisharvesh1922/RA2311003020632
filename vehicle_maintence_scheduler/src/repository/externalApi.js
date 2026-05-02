const axios = require("axios");
const { BEARER_TOKEN } = require("../config");
const { Log } = require("../../../logging middleware/logger");


async function fetchDepots() {
  try {
    const response = await axios.get("http://20.207.122.201/evaluation-service/depots", {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    await Log("backend", "info", "repository", "Depots fetched successfully from external API");
    return response.data.depots;
  } catch (err) {
    await Log(
      "backend",
      "error",
      "repository",
      `Failed to fetch depots from external API: ${err.message}`
    );
    throw err;
  }
}


async function fetchVehicles() {
  try {
    const response = await axios.get("http://20.207.122.201/evaluation-service/vehicles", {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    await Log("backend", "info", "repository", "Vehicles fetched successfully from external API");
    return response.data.vehicles;
  } catch (err) {
    await Log(
      "backend",
      "error",
      "repository",
      `Failed to fetch vehicles from external API: ${err.message}`
    );
    throw err;
  }
}

module.exports = { fetchDepots, fetchVehicles };
