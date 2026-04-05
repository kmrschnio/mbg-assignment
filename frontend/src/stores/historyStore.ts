import { create } from "zustand";
import { fetchHistory, type OHLCData } from "../api/http";

interface HistoryStore {
  candles: OHLCData[];
  timeframe: string;
  loading: boolean;
  error: string | null;
  loadHistory: (ticker: string, timeframe?: string) => Promise<void>;
  setTimeframe: (tf: string) => void;
  appendTick: (tick: { ticker: string; price: number; timestamp: number; volume: number }) => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  candles: [],
  timeframe: "1m",
  loading: false,
  error: null,

  loadHistory: async (ticker, timeframe) => {
    const tf = timeframe || get().timeframe;
    set({ loading: true, error: null, timeframe: tf });
    try {
      const data = await fetchHistory(ticker, tf, 200);
      set({ candles: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  setTimeframe: (tf) => set({ timeframe: tf }),

  appendTick: (tick) => {
    set((state) => {
      if (state.candles.length === 0) return state;

      const last = state.candles[state.candles.length - 1];

      // if tick belongs to the same candle bucket, update it
      const bucketMs = getTimeframeMs(state.timeframe);
      const lastBucket = Math.floor(last.timestamp / bucketMs) * bucketMs;
      const tickBucket = Math.floor(tick.timestamp / bucketMs) * bucketMs;

      if (tickBucket === lastBucket) {
        const updated: OHLCData = {
          ...last,
          high: Math.max(last.high, tick.price),
          low: Math.min(last.low, tick.price),
          close: tick.price,
          volume: last.volume + tick.volume,
        };
        return { candles: [...state.candles.slice(0, -1), updated] };
      }

      // new bucket — create a new candle
      const newCandle: OHLCData = {
        ticker: tick.ticker,
        open: tick.price,
        high: tick.price,
        low: tick.price,
        close: tick.price,
        volume: tick.volume,
        timestamp: tickBucket,
        timeframe: state.timeframe,
      };

      const candles = [...state.candles, newCandle];
      // keep max 300 candles
      if (candles.length > 300) candles.shift();
      return { candles };
    });
  },
}));

function getTimeframeMs(tf: string): number {
  const map: Record<string, number> = {
    "1m": 60000,
    "5m": 300000,
    "15m": 900000,
    "1h": 3600000,
    "1d": 86400000,
  };
  return map[tf] || 60000;
}
