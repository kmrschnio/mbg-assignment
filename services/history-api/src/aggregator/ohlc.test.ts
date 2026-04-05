import { describe, it, expect } from "vitest";
import { buildCandle, getBucketStart } from "./ohlc.js";

describe("buildCandle", () => {
  const ticks = [
    { price: 100, timestamp: 0, volume: 500 },
    { price: 105, timestamp: 10, volume: 300 },
    { price: 98, timestamp: 20, volume: 400 },
    { price: 102, timestamp: 30, volume: 200 },
  ];

  it("open equals first tick price", () => {
    const candle = buildCandle(ticks, "AAPL", "1m");
    expect(candle!.open).toBe(100);
  });

  it("close equals last tick price", () => {
    const candle = buildCandle(ticks, "AAPL", "1m");
    expect(candle!.close).toBe(102);
  });

  it("high equals maximum price", () => {
    const candle = buildCandle(ticks, "AAPL", "1m");
    expect(candle!.high).toBe(105);
  });

  it("low equals minimum price", () => {
    const candle = buildCandle(ticks, "AAPL", "1m");
    expect(candle!.low).toBe(98);
  });

  it("volume is sum of all tick volumes", () => {
    const candle = buildCandle(ticks, "AAPL", "1m");
    expect(candle!.volume).toBe(1400);
  });

  it("returns null for empty tick array", () => {
    expect(buildCandle([], "AAPL", "1m")).toBeNull();
  });

  it("single tick produces candle with all price fields equal", () => {
    const candle = buildCandle([{ price: 100, timestamp: 0, volume: 500 }], "AAPL", "1m");
    expect(candle!.open).toBe(100);
    expect(candle!.high).toBe(100);
    expect(candle!.low).toBe(100);
    expect(candle!.close).toBe(100);
  });
});

describe("getBucketStart", () => {
  it("buckets to 1-minute boundaries", () => {
    const ts = 1700000090000; // some timestamp
    const bucket = getBucketStart(ts, "1m");
    expect(bucket % 60000).toBe(0);
    expect(bucket).toBeLessThanOrEqual(ts);
    expect(ts - bucket).toBeLessThan(60000);
  });

  it("buckets to 1-hour boundaries", () => {
    const ts = 1700000090000;
    const bucket = getBucketStart(ts, "1h");
    expect(bucket % 3600000).toBe(0);
  });
});
