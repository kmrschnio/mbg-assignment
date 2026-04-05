import type { Alert } from "@trading/shared";
import { randomUUID } from "crypto";

const alerts = new Map<string, Alert>();

export function createAlert(ticker: string, condition: "above" | "below", threshold: number): Alert {
  const alert: Alert = {
    id: randomUUID(),
    ticker,
    condition,
    threshold,
    triggered: false,
    createdAt: Date.now(),
  };
  alerts.set(alert.id, alert);
  return alert;
}

export function getAlerts(): Alert[] {
  return Array.from(alerts.values());
}

export function getActiveAlerts(): Alert[] {
  return Array.from(alerts.values()).filter((a) => !a.triggered);
}

export function triggerAlert(id: string): Alert | undefined {
  const alert = alerts.get(id);
  if (alert) {
    alert.triggered = true;
    alert.triggeredAt = Date.now();
  }
  return alert;
}

export function deleteAlert(id: string): boolean {
  return alerts.delete(id);
}
