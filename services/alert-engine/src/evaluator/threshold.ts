import type { AlertRule } from "@trading/shared";

/**
 * Evaluate whether a price triggers an alert rule.
 * Pure function — no side effects.
 */
export function evaluate(rule: AlertRule, price: number): boolean {
  switch (rule.condition) {
    case "above":
      return price > rule.threshold;
    case "below":
      return price < rule.threshold;
    default:
      return false;
  }
}
