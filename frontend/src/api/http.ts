const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export interface TickerInfo {
  symbol: string;
  name: string;
}

export interface OHLCData {
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
  timeframe: string;
}

export function fetchTickers(): Promise<TickerInfo[]> {
  return fetchJSON("/tickers");
}

export function fetchHistory(
  ticker: string,
  timeframe: string = "1m",
  limit: number = 500
): Promise<OHLCData[]> {
  return fetchJSON(`/history/${ticker}?timeframe=${timeframe}&limit=${limit}`);
}
