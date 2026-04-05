import NodeCache from "node-cache";
import type { OHLC, Timeframe } from "@trading/shared";

/** TTL in seconds per timeframe — shorter timeframes expire faster */
const TTL_MAP: Record<Timeframe, number> = {
  "1m": 10,
  "5m": 30,
  "15m": 60,
  "1h": 120,
  "1d": 300,
};

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ checkperiod: 30 });
  }

  get(key: string): OHLC[] | null {
    const data = this.cache.get<OHLC[]>(key);
    if (data) {
      console.log(`[cache] hit: ${key}`);
      return data;
    }
    return null;
  }

  set(key: string, data: OHLC[]): void {
    const timeframe = key.split(":")[1] as Timeframe;
    const ttl = TTL_MAP[timeframe] || 30;
    this.cache.set(key, data, ttl);
  }
}
