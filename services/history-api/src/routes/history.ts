import { Router } from "express";
import type { OHLC, Timeframe } from "@trading/shared";
import { TICKER_SYMBOLS } from "@trading/shared";
import { CacheService } from "../cache/cacheService.js";

const VALID_TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "1d"];

interface HistoryDeps {
  getHistory: (ticker: string, timeframe: Timeframe) => OHLC[];
  cache: CacheService;
}

export function createHistoryRouter({ getHistory, cache }: HistoryDeps): Router {
  const router = Router();

  /** GET /history/:ticker?timeframe=1m&limit=500 */
  router.get("/:ticker", (req, res) => {
    const { ticker } = req.params;
    const timeframe = (req.query.timeframe as Timeframe) || "1m";
    const limit = parseInt(req.query.limit as string, 10) || 500;

    // validate ticker
    if (!TICKER_SYMBOLS.includes(ticker)) {
      res.status(400).json({ error: `unknown ticker: ${ticker}` });
      return;
    }

    // validate timeframe
    if (!VALID_TIMEFRAMES.includes(timeframe)) {
      res.status(400).json({ error: `invalid timeframe: ${timeframe}` });
      return;
    }

    // check cache first
    const cacheKey = `${ticker}:${timeframe}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.json(cached.slice(-limit));
      return;
    }

    // fetch from store
    const data = getHistory(ticker, timeframe);
    cache.set(cacheKey, data);

    res.json(data.slice(-limit));
  });

  return router;
}
