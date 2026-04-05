import { usePriceStore } from "../../stores/priceStore";
import { TickerCard } from "./TickerCard";

interface Props {
  tickers: string[];
  selectedTicker: string;
  onSelect: (ticker: string) => void;
}

export function TickerList({ tickers, selectedTicker, onSelect }: Props) {
  const prices = usePriceStore((s) => s.prices);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <h3 style={{ color: "#8b949e", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 0" }}>
        Instruments
      </h3>
      {tickers.map((ticker) => (
        <TickerCard
          key={ticker}
          ticker={ticker}
          data={prices[ticker]}
          isSelected={ticker === selectedTicker}
          onClick={() => onSelect(ticker)}
        />
      ))}
    </div>
  );
}
