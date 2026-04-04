export interface Alert {
  id: string;
  ticker: string;
  condition: "above" | "below";
  threshold: number;
  triggered: boolean;
  createdAt: number;
  triggeredAt?: number;
}

export interface AlertRule {
  ticker: string;
  condition: "above" | "below";
  threshold: number;
}
