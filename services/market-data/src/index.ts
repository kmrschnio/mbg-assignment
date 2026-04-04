import { TICKERS } from "@trading/shared";
import type { Tick, TickMessage } from "@trading/shared";
import { gbm } from "./simulator/gbm.js";
import { createWSServer } from "./ws/server.js";

const PORT = parseInt(process.env.MARKET_DATA_PORT || "3001", 10);
const TICK_INTERVAL_MS = 1000;

// current prices, initialized from ticker configs
const prices: Record<string, number> = {};
for (const t of TICKERS) {
  prices[t.symbol] = t.basePrice;
}

const { subscriptions } = createWSServer(PORT);

// run the simulator — update prices every second and broadcast
const dt = TICK_INTERVAL_MS / 1000 / (60 * 60 * 24 * 365); // convert ms to years for GBM

setInterval(() => {
  for (const ticker of TICKERS) {
    const newPrice = gbm(prices[ticker.symbol], ticker.drift, ticker.volatility, dt);
    prices[ticker.symbol] = newPrice;

    const tick: Tick = {
      ticker: ticker.symbol,
      price: parseFloat(newPrice.toFixed(2)),
      timestamp: Date.now(),
      volume: Math.floor(Math.random() * 10000) + 100,
    };

    const message: TickMessage = { type: "tick", payload: tick };
    subscriptions.broadcast(ticker.symbol, message);
  }
}, TICK_INTERVAL_MS);

console.log(`[market-data] simulator running, ${TICKERS.length} tickers at ${TICK_INTERVAL_MS}ms interval`);
