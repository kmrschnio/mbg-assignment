import type { TickData } from "../../stores/priceStore";

interface Props {
  ticker: string;
  data: TickData | undefined;
  isSelected: boolean;
  onClick: () => void;
}

export function TickerCard({ ticker, data, isSelected, onClick }: Props) {
  const isUp = data ? data.price >= data.prevPrice : true;
  const change = data ? data.price - data.prevPrice : 0;
  const changePercent = data && data.prevPrice ? ((change / data.prevPrice) * 100) : 0;

  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        background: isSelected ? "#1f2937" : "#161b22",
        border: isSelected ? "1px solid #58a6ff" : "1px solid #30363d",
        transition: "border-color 0.2s, background 0.2s",
        minWidth: "0",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "13px", color: "#c9d1d9" }}>
        {ticker}
      </div>
      <div style={{ color: isUp ? "#3fb950" : "#f85149", fontSize: "18px", fontWeight: "bold" }}>
        {data ? formatPrice(data.price) : "—"}
      </div>
      {data && (
        <div style={{ color: isUp ? "#3fb950" : "#f85149", fontSize: "11px", marginTop: "2px" }}>
          {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(3)}%
        </div>
      )}
    </div>
  );
}

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(2)}`;
}
