const TIMEFRAMES = ["1m", "5m", "15m", "1h", "1d"];

interface Props {
  selected: string;
  onChange: (tf: string) => void;
}

export function TimeframeSelector({ selected, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "13px",
            fontWeight: selected === tf ? "bold" : "normal",
            background: selected === tf ? "#58a6ff" : "#21262d",
            color: selected === tf ? "#0d1117" : "#8b949e",
          }}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
