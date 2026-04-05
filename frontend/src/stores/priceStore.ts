import { create } from "zustand";

export interface TickData {
  ticker: string;
  price: number;
  prevPrice: number;
  timestamp: number;
  volume: number;
}

interface PriceStore {
  prices: Record<string, TickData>;
  updateTick: (tick: { ticker: string; price: number; timestamp: number; volume: number }) => void;
}

export const usePriceStore = create<PriceStore>((set) => ({
  prices: {},
  updateTick: (tick) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [tick.ticker]: {
          ticker: tick.ticker,
          price: tick.price,
          prevPrice: state.prices[tick.ticker]?.price ?? tick.price,
          timestamp: tick.timestamp,
          volume: tick.volume,
        },
      },
    })),
}));
