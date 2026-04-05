import { describe, it, expect } from "vitest";
import { evaluate } from "./threshold.js";

describe("threshold evaluator", () => {
  it("triggers when price crosses above threshold", () => {
    const rule = { ticker: "AAPL", condition: "above" as const, threshold: 150 };
    expect(evaluate(rule, 151)).toBe(true);
    expect(evaluate(rule, 149)).toBe(false);
  });

  it("triggers when price crosses below threshold", () => {
    const rule = { ticker: "AAPL", condition: "below" as const, threshold: 150 };
    expect(evaluate(rule, 149)).toBe(true);
    expect(evaluate(rule, 151)).toBe(false);
  });

  it("exact threshold price does not trigger for above", () => {
    const rule = { ticker: "AAPL", condition: "above" as const, threshold: 150 };
    expect(evaluate(rule, 150)).toBe(false);
  });

  it("exact threshold price does not trigger for below", () => {
    const rule = { ticker: "AAPL", condition: "below" as const, threshold: 150 };
    expect(evaluate(rule, 150)).toBe(false);
  });
});
