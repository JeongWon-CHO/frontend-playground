import type { Order } from "./orders";

// Deliberately expensive, deterministic demand simulation. Every sample contributes
// to the displayed result; there is no artificial delay or busy-wait timer.
export function calculateForecast(orders: Order[], samples: number) {
  const months = Array<number>(12).fill(0);
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];
    let estimatedRevenue = 0;
    for (let sample = 0; sample < samples; sample++) {
      const demand = 1.08 + Math.sin((index + 1) * (sample + 1) * 0.017) * 0.24;
      estimatedRevenue += order.amount * demand;
    }
    months[order.month - 1] += estimatedRevenue / samples;
  }
  return months;
}
