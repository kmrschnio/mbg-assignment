import express from "express";
import cors from "cors";
import type { Timeframe } from "@trading/shared";
import { seedHistory } from "./aggregator/seed.js";
import { CacheService } from "./cache/cacheService.js";
import { authMiddleware } from "./middleware/auth.js";
import tickerRoutes from "./routes/tickers.js";
import { createHistoryRouter } from "./routes/history.js";

const PORT = parseInt(process.env.HISTORY_API_PORT || "3002", 10);

// seed historical data on startup
console.log("[history-api] seeding historical data...");
const historyStore = seedHistory(500);
console.log(`[history-api] seeded ${historyStore.size} tickers`);

const cache = new CacheService();

const app = express();
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// routes
app.use("/tickers", tickerRoutes);
app.use(
  "/history",
  createHistoryRouter({
    getHistory: (ticker, timeframe) => {
      const tfMap = historyStore.get(ticker);
      if (!tfMap) return [];
      return tfMap.get(timeframe as Timeframe) || [];
    },
    cache,
  })
);

app.listen(PORT, () => {
  console.log(`[history-api] listening on port ${PORT}`);
});
