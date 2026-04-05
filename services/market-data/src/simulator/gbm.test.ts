import { describe, it, expect } from "vitest";
import { gbm } from "./gbm.js";

describe("gbm", () => {
  it("returns a positive number", () => {
    const result = gbm(100, 0.05, 0.2, 1);
    expect(result).toBeGreaterThan(0);
  });

  it("returns input price when drift and volatility are zero", () => {
    const result = gbm(100, 0, 0, 1);
    expect(result).toBe(100);
  });

  it("handles very small price values", () => {
    const result = gbm(0.001, 0.05, 0.2, 1);
    expect(result).toBeGreaterThan(0);
  });

  it("mean price drifts upward with positive drift", () => {
    const results = Array.from({ length: 10000 }, () => gbm(100, 0.5, 0.2, 1));
    const mean = results.reduce((a, b) => a + b) / results.length;
    expect(mean).toBeGreaterThan(100);
  });

  it("higher volatility produces wider price spread", () => {
    const lowVol = Array.from({ length: 10000 }, () => gbm(100, 0, 0.1, 1));
    const highVol = Array.from({ length: 10000 }, () => gbm(100, 0, 0.5, 1));

    const stdDev = (arr: number[]) => {
      const mean = arr.reduce((a, b) => a + b) / arr.length;
      const sq = arr.map((x) => (x - mean) ** 2);
      return Math.sqrt(sq.reduce((a, b) => a + b) / arr.length);
    };

    expect(stdDev(highVol)).toBeGreaterThan(stdDev(lowVol));
  });
});
