import { useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useHistoryStore } from "../../stores/historyStore";
import { usePriceStore } from "../../stores/priceStore";
import { TimeframeSelector } from "./TimeframeSelector";

interface Props {
  ticker: string;
}

export function LiveChart({ ticker }: Props) {
  const { candles, timeframe, loading, loadHistory, setTimeframe, appendTick } =
    useHistoryStore();
  const prevTickerRef = useRef(ticker);
  const prevTimeframeRef = useRef(timeframe);

  // load history when ticker or timeframe changes
  useEffect(() => {
    loadHistory(ticker, timeframe);
    prevTickerRef.current = ticker;
    prevTimeframeRef.current = timeframe;
  }, [ticker, timeframe, loadHistory]);

  // append live ticks to the chart
  const prices = usePriceStore((s) => s.prices);
  const tickData = prices[ticker];
  const prevTimestampRef = useRef<number>(0);

  useEffect(() => {
    if (!tickData || tickData.timestamp === prevTimestampRef.current) return;
    prevTimestampRef.current = tickData.timestamp;

    if (prevTickerRef.current === ticker) {
      appendTick({
        ticker: tickData.ticker,
        price: tickData.price,
        timestamp: tickData.timestamp,
        volume: tickData.volume,
      });
    }
  }, [tickData, ticker, appendTick]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
  };

  // format chart data
  const chartData = candles.map((c) => ({
    time: formatTime(c.timestamp, timeframe),
    close: c.close,
    high: c.high,
    low: c.low,
    open: c.open,
    volume: c.volume,
  }));

  // compute Y domain with padding
  const closePrices = candles.map((c) => c.close);
  const minPrice = Math.min(...closePrices, ...candles.map((c) => c.low));
  const maxPrice = Math.max(...closePrices, ...candles.map((c) => c.high));
  const padding = (maxPrice - minPrice) * 0.05 || 1;

  return (
    <div>
      <TimeframeSelector selected={timeframe} onChange={handleTimeframeChange} />

      {loading ? (
        <div style={{ color: "#8b949e", padding: "40px", textAlign: "center" }}>
          Loading chart data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
            <XAxis
              dataKey="time"
              tick={{ fill: "#8b949e", fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tick={{ fill: "#8b949e", fontSize: 11 }}
              tickFormatter={(v: number) => v.toFixed(2)}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "6px",
                color: "#c9d1d9",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
            />
            <Bar dataKey="volume" fill="#21262d" opacity={0.3} yAxisId="volume" />
            <YAxis yAxisId="volume" orientation="right" hide />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#58a6ff"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function formatTime(timestamp: number, timeframe: string): string {
  const d = new Date(timestamp);
  if (timeframe === "1d") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}
