import { useState, useMemo } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { usePriceStore } from "./stores/priceStore";
import { Header } from "./components/Layout/Header";
import { Dashboard } from "./components/Layout/Dashboard";
import { TickerList } from "./components/TickerList/TickerList";
import { LiveChart } from "./components/Chart/LiveChart";
import { AlertPanel } from "./components/Alerts/AlertPanel";

const ALL_TICKERS = ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA", "BTC-USD", "ETH-USD"];

function App() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const tickerList = useMemo(() => ALL_TICKERS, []);

  useWebSocket(tickerList);

  const prices = usePriceStore((s) => s.prices);
  const currentPrice = prices[selectedTicker];

  return (
    <div style={{ background: "#0d1117", color: "#c9d1d9", minHeight: "100vh", fontFamily: "monospace" }}>
      <Header />
      <Dashboard
        sidebar={
          <>
            <TickerList
              tickers={tickerList}
              selectedTicker={selectedTicker}
              onSelect={setSelectedTicker}
            />
            <AlertPanel />
          </>
        }
        main={
          <div
            style={{
              padding: "20px",
              background: "#161b22",
              borderRadius: "8px",
              border: "1px solid #30363d",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
              <h2 style={{ color: "#f0f6fc", margin: 0, fontSize: "20px" }}>
                {selectedTicker}
              </h2>
              {currentPrice && (
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: currentPrice.price >= currentPrice.prevPrice ? "#3fb950" : "#f85149",
                    }}
                  >
                    ${currentPrice.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <LiveChart ticker={selectedTicker} />
          </div>
        }
      />
    </div>
  );
}

export default App;
