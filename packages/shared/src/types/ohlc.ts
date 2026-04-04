export interface OHLC {
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
  timeframe: Timeframe;
}

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "1d";
