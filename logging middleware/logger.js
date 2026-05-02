const axios = require("axios");

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYjIyNTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTM2NywiaWF0IjoxNzc3NzA0NDY3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiY2VmM2NkYjMtZTM1YS00ZGQzLWJjMDktNTIzMjJiOTI5Y2IxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2Fpc2hhcnZlc2ggYiIsInN1YiI6ImMyMTRmNWQ3LWIzMDUtNDJiYy05ODVmLTM3NGFlMGRlY2E4ZSJ9LCJlbWFpbCI6InNiMjI1OUBzcm1pc3QuZWR1LmluIiwibmFtZSI6InNhaXNoYXJ2ZXNoIGIiLCJyb2xsTm8iOiJyYTIzMTEwMDMwMjA2MzIiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJjMjE0ZjVkNy1iMzA1LTQyYmMtOTg1Zi0zNzRhZTBkZWNhOGUiLCJjbGllbnRTZWNyZXQiOiJUZGNrUlhQdG5GV3BuTnhDIn0.C6gBABKoknaigH85HLqZW38EjxRAa0vdq_G5OxqslEU";

// Valid values
const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
];

async function Log(stack, level, pkg, message) {
  // Basic validation before sending
  if (!VALID_STACKS.includes(stack)) {
    console.error(`[Logger] Invalid stack: "${stack}". Must be one of: ${VALID_STACKS.join(", ")}`);
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`[Logger] Invalid level: "${level}". Must be one of: ${VALID_LEVELS.join(", ")}`);
    return;
  }
  if (!VALID_PACKAGES.includes(pkg)) {
    console.error(`[Logger] Invalid package: "${pkg}". Must be one of: ${VALID_PACKAGES.join(", ")}`);
    return;
  }

  const body = {
    stack: stack,
    level: level,
    package: pkg,
    message: message,
  };

  try {
    const response = await axios.post(LOG_API_URL, body, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`[Logger] [${level.toUpperCase()}] [${stack}/${pkg}] ${message}`);
    return response.data;
  } catch (err) {
    
    console.error(`[Logger] Failed to send log to API: ${err.message}`);
  }
}

module.exports = { Log };
