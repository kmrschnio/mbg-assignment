export interface TickerConfig {
  symbol: string;
  name: string;
  basePrice: number;
  drift: number;
  volatility: number;
}

export const TICKERS: TickerConfig[] = [
  { symbol: "AAPL",    name: "Apple Inc.",           basePrice: 195,   drift: 0.05, volatility: 0.20 },
  { symbol: "TSLA",    name: "Tesla Inc.",           basePrice: 175,   drift: 0.08, volatility: 0.35 },
  { symbol: "MSFT",    name: "Microsoft Corp.",      basePrice: 420,   drift: 0.04, volatility: 0.18 },
  { symbol: "GOOGL",   name: "Alphabet Inc.",        basePrice: 155,   drift: 0.05, volatility: 0.22 },
  { symbol: "NVDA",    name: "NVIDIA Corp.",         basePrice: 880,   drift: 0.10, volatility: 0.40 },
  { symbol: "BTC-USD", name: "Bitcoin",              basePrice: 67000, drift: 0.06, volatility: 0.30 },
  { symbol: "ETH-USD", name: "Ethereum",             basePrice: 3400,  drift: 0.07, volatility: 0.35 },
];

export const TICKER_SYMBOLS = TICKERS.map((t) => t.symbol);
