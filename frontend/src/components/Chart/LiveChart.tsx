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
  Cell,
} from "recharts";
import { useHistoryStore } from "../../stores/historyStore";
import { usePriceStore } from "../../stores/priceStore";
import { TimeframeSelector } from "./TimeframeSelector";

export type ChartType = "line" | "candlestick";

interface Props {
  ticker: string;
  chartType: ChartType;
}

const CANDLE_LIMIT = 60;

export function LiveChart({ ticker, chartType }: Props) {
  const { candles, timeframe, loading, loadHistory, setTimeframe, appendTick } =
    useHistoryStore();
  const prevTickerRef = useRef(ticker);
  const prevTimeframeRef = useRef(timeframe);

  useEffect(() => {
    loadHistory(ticker, timeframe);
    prevTickerRef.current = ticker;
    prevTimeframeRef.current = timeframe;
  }, [ticker, timeframe, loadHistory]);

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

  // show same number of candles for both chart types
  const visibleCandles = candles.slice(-CANDLE_LIMIT);

  const allPrices = visibleCandles.flatMap((c) => [c.high, c.low]);
  const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length ? Math.max(...allPrices) : 100;
  const padding = (maxPrice - minPrice) * 0.05 || 1;
  const domainMin = minPrice - padding;
  const domainMax = maxPrice + padding;

  const chartData = visibleCandles.map((c) => ({
    time: formatTime(c.timestamp, timeframe),
    close: c.close,
    high: c.high,
    low: c.low,
    open: c.open,
    volume: c.volume,
    // pass domain info for the custom candlestick shape
    _domainMin: domainMin,
    _domainMax: domainMax,
  }));

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
              domain={[domainMin, domainMax]}
              tick={{ fill: "#8b949e", fontSize: 11 }}
              tickFormatter={(v: number) => v.toFixed(2)}
              width={80}
            />
            <Tooltip content={<CandlestickTooltip />} />
            <Bar dataKey="volume" fill="#21262d" opacity={0.3} yAxisId="volume" />
            <YAxis yAxisId="volume" orientation="right" hide />

            {chartType === "line" ? (
              <Line
                type="monotone"
                dataKey="close"
                stroke="#58a6ff"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ) : (
              <Bar
                dataKey="high"
                isAnimationActive={false}
                shape={(props: any) => <CandlestickBar {...props} />}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.close >= entry.open ? "#3fb950" : "#f85149"}
                  />
                ))}
              </Bar>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/** Custom candlestick shape — draws wick + body using SVG */
function CandlestickBar(props: any) {
  const { x, y, width, height, payload, fill } = props;
  if (!payload) return null;

  const { open, close, high, low, _domainMin } = payload;

  // y = pixel position of the "high" value (top of the bar)
  // y + height = pixel position of the domain minimum (bottom of the bar)
  // scale maps price difference to pixels
  const priceRange = high - _domainMin;
  if (priceRange === 0) return null;

  const pxPerPrice = height / priceRange;
  const wickX = x + width / 2;

  // wick: from high to low
  const wickTop = y;
  const wickBottom = y + (high - low) * pxPerPrice;

  // body: from open to close
  const bodyTop = y + (high - Math.max(open, close)) * pxPerPrice;
  const bodyBottom = y + (high - Math.min(open, close)) * pxPerPrice;
  const bodyH = Math.max(bodyBottom - bodyTop, 2);

  return (
    <g>
      <line
        x1={wickX}
        y1={wickTop}
        x2={wickX}
        y2={wickBottom}
        stroke={fill}
        strokeWidth={1.5}
      />
      <rect
        x={x + width * 0.1}
        y={bodyTop}
        width={width * 0.8}
        height={bodyH}
        fill={fill}
        rx={1}
      />
    </g>
  );
}

function CandlestickTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "6px",
        padding: "8px 12px",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#c9d1d9",
      }}
    >
      <div>O: <span style={{ color: "#58a6ff" }}>${d.open.toFixed(2)}</span></div>
      <div>H: <span style={{ color: "#3fb950" }}>${d.high.toFixed(2)}</span></div>
      <div>L: <span style={{ color: "#f85149" }}>${d.low.toFixed(2)}</span></div>
      <div>C: <span style={{ color: "#58a6ff" }}>${d.close.toFixed(2)}</span></div>
      <div style={{ color: "#8b949e", marginTop: "4px" }}>Vol: {d.volume.toLocaleString()}</div>
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
