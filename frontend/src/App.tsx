import { useState, useMemo } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { usePriceStore } from "./stores/priceStore";

const ALL_TICKERS = ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA", "BTC-USD", "ETH-USD"];

function App() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const tickerList = useMemo(() => ALL_TICKERS, []);

  useWebSocket(tickerList);

  const prices = usePriceStore((s) => s.prices);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", background: "#0d1117", color: "#c9d1d9", minHeight: "100vh" }}>
      <h1 style={{ color: "#58a6ff", marginBottom: "24px" }}>Trading Dashboard</h1>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
        {tickerList.map((ticker) => {
          const data = prices[ticker];
          const isUp = data ? data.price >= data.prevPrice : true;
          const isSelected = ticker === selectedTicker;

          return (
            <div
              key={ticker}
              onClick={() => setSelectedTicker(ticker)}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                background: isSelected ? "#1f2937" : "#161b22",
                border: isSelected ? "1px solid #58a6ff" : "1px solid #30363d",
                minWidth: "120px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{ticker}</div>
              <div style={{ color: isUp ? "#3fb950" : "#f85149", fontSize: "18px" }}>
                {data ? `$${data.price.toFixed(2)}` : "—"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "20px", background: "#161b22", borderRadius: "8px", border: "1px solid #30363d" }}>
        <h2 style={{ color: "#58a6ff" }}>
          {selectedTicker} — {prices[selectedTicker] ? `$${prices[selectedTicker].price.toFixed(2)}` : "Loading..."}
        </h2>
        <p style={{ color: "#8b949e" }}>Chart coming in next task...</p>
      </div>
    </div>
  );
}

export default App;
