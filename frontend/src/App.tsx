import { useState, useMemo } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { usePriceStore } from "./stores/priceStore";
import { useAuthStore } from "./stores/authStore";
import { LoginScreen } from "./components/Auth/LoginScreen";
import { Header } from "./components/Layout/Header";
import { Dashboard } from "./components/Layout/Dashboard";
import { TickerList } from "./components/TickerList/TickerList";
import { LiveChart } from "./components/Chart/LiveChart";
import type { ChartType } from "./components/Chart/LiveChart";
import { AlertPanel } from "./components/Alerts/AlertPanel";

const ALL_TICKERS = ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA", "BTC-USD", "ETH-USD"];

function App() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <LoginScreen />;
  }

  return <DashboardView />;
}

function DashboardView() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [chartType, setChartType] = useState<ChartType>("line");
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ color: "#f0f6fc", margin: 0, fontSize: "20px" }}>
                {selectedTicker}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {currentPrice && (
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: currentPrice.price >= currentPrice.prevPrice ? "#3fb950" : "#f85149",
                    }}
                  >
                    ${currentPrice.price.toFixed(2)}
                  </span>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    background: "#0d1117",
                    borderRadius: "6px",
                    padding: "3px",
                    border: "1px solid #30363d",
                  }}
                >
                  <button
                    onClick={() => setChartType("line")}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      background: chartType === "line" ? "#58a6ff" : "transparent",
                      color: chartType === "line" ? "#0d1117" : "#8b949e",
                    }}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType("candlestick")}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      background: chartType === "candlestick" ? "#58a6ff" : "transparent",
                      color: chartType === "candlestick" ? "#0d1117" : "#8b949e",
                    }}
                  >
                    Candle
                  </button>
                </div>
              </div>
            </div>
            <LiveChart ticker={selectedTicker} chartType={chartType} />
          </div>
        }
      />
    </div>
  );
}

export default App;
