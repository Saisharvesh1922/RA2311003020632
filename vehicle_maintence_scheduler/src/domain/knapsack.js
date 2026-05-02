/**
 * 
 *
 * @param {Array<{ TaskID: string, Duration: number, Impact: number }>} vehicles
 * @param {number} budget  — total mechanic hours available (capacity)
 * @returns {{ scheduled: Array, totalImpact: number, totalDuration: number }}
 */
function knapsack(vehicles, budget) {
  const n = vehicles.length;

  const dp = new Array(budget + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const { Duration, Impact } = vehicles[i];
    
    for (let w = budget; w >= Duration; w--) {
      dp[w] = Math.max(dp[w], dp[w - Duration] + Impact);
    }
  }

  const selected = [];
  let remainingCapacity = budget;

  for (let i = n - 1; i >= 0 && remainingCapacity > 0; i--) {
    const { Duration, Impact } = vehicles[i];
    if (
      remainingCapacity >= Duration &&
      dp[remainingCapacity] === dp[remainingCapacity - Duration] + Impact
    ) {
      selected.push(vehicles[i]);
      remainingCapacity -= Duration;
    }
  }

  return {
    scheduled: selected,
    totalImpact: dp[budget],
    totalDuration: budget - remainingCapacity,
  };
}

module.exports = { knapsack };
