import type { OHLC } from "@trading/shared";

/**
 * Cache service — currently a passthrough (no-op).
 * Swap to real NodeCache implementation in bonus phase
 * without changing any route logic.
 */
export class CacheService {
  get(_key: string): OHLC[] | null {
    return null; // always miss
  }

  set(_key: string, _data: OHLC[]): void {
    // no-op
  }
}
