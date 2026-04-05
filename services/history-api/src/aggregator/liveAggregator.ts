import WebSocket from "ws";
import type { Tick, OHLC, Timeframe } from "@trading/shared";
import { TICKER_SYMBOLS } from "@trading/shared";
import { buildCandle, getBucketStart, TIMEFRAME_MS } from "./ohlc.js";

/**
 * Connects to market-data WebSocket and aggregates live ticks
 * into OHLC candles, appending them to the seeded history store.
 */
export function startLiveAggregator(
  marketDataUrl: string,
  historyStore: Map<string, Map<Timeframe, OHLC[]>>
): void {
  // buffer ticks per ticker per timeframe bucket
  const buffers = new Map<string, Map<Timeframe, { bucketStart: number; ticks: Pick<Tick, "price" | "timestamp" | "volume">[] }>>();

  function connect() {
    const ws = new WebSocket(marketDataUrl);

    ws.on("open", () => {
      console.log("[live-aggregator] connected to market-data");
      ws.send(
        JSON.stringify({
          type: "subscribe",
          payload: { tickers: TICKER_SYMBOLS },
        })
      );
    });

    ws.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "tick") {
          handleTick(msg.payload, historyStore, buffers);
        }
      } catch {
        // ignore malformed messages
      }
    });

    ws.on("close", () => {
      console.log("[live-aggregator] disconnected, reconnecting in 3s...");
      setTimeout(connect, 3000);
    });

    ws.on("error", () => {
      // will trigger close event
    });
  }

  connect();
}

function handleTick(
  tick: Tick,
  historyStore: Map<string, Map<Timeframe, OHLC[]>>,
  buffers: Map<string, Map<Timeframe, { bucketStart: number; ticks: Pick<Tick, "price" | "timestamp" | "volume">[] }>>
): void {
  const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "1d"];

  for (const tf of timeframes) {
    const bucketStart = getBucketStart(tick.timestamp, tf);
    const bufferKey = `${tick.ticker}:${tf}`;

    if (!buffers.has(tick.ticker)) {
      buffers.set(tick.ticker, new Map());
    }
    const tickerBuffers = buffers.get(tick.ticker)!;

    const existing = tickerBuffers.get(tf);

    if (!existing || existing.bucketStart !== bucketStart) {
      // new bucket — flush old one if it exists
      if (existing && existing.ticks.length > 0) {
        const candle = buildCandle(existing.ticks, tick.ticker, tf);
        if (candle) {
          const tfMap = historyStore.get(tick.ticker);
          if (tfMap) {
            const candles = tfMap.get(tf) || [];
            candles.push(candle);
            // keep only last 1000 candles per timeframe
            if (candles.length > 1000) candles.shift();
          }
        }
      }
      tickerBuffers.set(tf, { bucketStart, ticks: [] });
    }

    tickerBuffers.get(tf)!.ticks.push({
      price: tick.price,
      timestamp: tick.timestamp,
      volume: tick.volume,
    });
  }
}
