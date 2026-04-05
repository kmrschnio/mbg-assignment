import type { OHLC, Timeframe } from "@trading/shared";
import { TICKERS } from "@trading/shared";
import type { TickerConfig } from "@trading/shared";
import { TIMEFRAME_MS } from "./ohlc.js";

/**
 * Pre-generate historical OHLC candles for all tickers using
 * a simplified GBM walk. This lets the chart show data immediately
 * without waiting for live ticks to accumulate.
 *
 * Returns: Map<ticker, Map<timeframe, OHLC[]>>
 */
export function seedHistory(
  candleCount: number = 500
): Map<string, Map<Timeframe, OHLC[]>> {
  const history = new Map<string, Map<Timeframe, OHLC[]>>();

  for (const ticker of TICKERS) {
    const timeframes = new Map<Timeframe, OHLC[]>();

    for (const tf of Object.keys(TIMEFRAME_MS) as Timeframe[]) {
      timeframes.set(tf, generateCandles(ticker, tf, candleCount));
    }

    history.set(ticker.symbol, timeframes);
  }

  return history;
}

function generateCandles(
  ticker: TickerConfig,
  timeframe: Timeframe,
  count: number
): OHLC[] {
  const intervalMs = TIMEFRAME_MS[timeframe];
  const now = Date.now();
  const startTime = now - count * intervalMs;

  let price = ticker.basePrice;
  const candles: OHLC[] = [];

  // scale volatility to timeframe (larger timeframes = larger moves)
  const dtYears = intervalMs / (1000 * 60 * 60 * 24 * 365);

  for (let i = 0; i < count; i++) {
    const timestamp = startTime + i * intervalMs;

    // simulate intra-candle movement with 4 price points
    const open = price;
    const moves = generateIntraMoves(price, ticker.drift, ticker.volatility, dtYears);
    const high = Math.max(open, ...moves);
    const low = Math.min(open, ...moves);
    const close = moves[moves.length - 1];

    candles.push({
      ticker: ticker.symbol,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume: Math.floor(Math.random() * 50000) + 1000,
      timestamp,
      timeframe,
    });

    price = close;
  }

  return candles;
}

/**
 * Generate a few intra-candle price moves to create
 * realistic OHLC values (not just open = close).
 */
function generateIntraMoves(
  price: number,
  drift: number,
  volatility: number,
  dt: number
): number[] {
  const stepDt = dt / 4;
  const moves: number[] = [];
  let p = price;

  for (let i = 0; i < 4; i++) {
    const z = boxMuller();
    const exponent =
      (drift - (volatility * volatility) / 2) * stepDt +
      volatility * Math.sqrt(stepDt) * z;
    p = p * Math.exp(exponent);
    moves.push(p);
  }

  return moves;
}

function boxMuller(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
