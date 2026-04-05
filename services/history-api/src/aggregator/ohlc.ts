import type { Tick, OHLC, Timeframe } from "@trading/shared";

/** Duration of each timeframe in milliseconds */
export const TIMEFRAME_MS: Record<Timeframe, number> = {
  "1m": 60 * 1000,
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
};

/**
 * Build an OHLC candle from an array of ticks.
 * Returns null if ticks array is empty.
 */
export function buildCandle(
  ticks: Pick<Tick, "price" | "timestamp" | "volume">[],
  ticker: string,
  timeframe: Timeframe
): OHLC | null {
  if (ticks.length === 0) return null;

  const prices = ticks.map((t) => t.price);
  const totalVolume = ticks.reduce((sum, t) => sum + t.volume, 0);

  return {
    ticker,
    open: prices[0],
    high: Math.max(...prices),
    low: Math.min(...prices),
    close: prices[prices.length - 1],
    volume: totalVolume,
    timestamp: ticks[0].timestamp,
    timeframe,
  };
}

/**
 * Get the bucket start timestamp for a given tick timestamp and timeframe.
 */
export function getBucketStart(timestamp: number, timeframe: Timeframe): number {
  const ms = TIMEFRAME_MS[timeframe];
  return Math.floor(timestamp / ms) * ms;
}
