import { useState } from "react";

const ALERT_URL = import.meta.env.VITE_ALERT_URL || `${window.location.origin}/api`;

interface Props {
  ticker: string;
  currentPrice: number | undefined;
}

export function AlertForm({ ticker, currentPrice }: Props) {
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(threshold);
    if (isNaN(price)) return;

    try {
      const res = await fetch(`${ALERT_URL}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, condition, threshold: price }),
      });

      if (res.ok) {
        setStatus("success");
        setThreshold("");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "12px" }}>
      <h3 style={{ color: "#8b949e", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>
        Set Alert — {ticker}
      </h3>
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as "above" | "below")}
          style={{
            padding: "6px 8px",
            borderRadius: "4px",
            border: "1px solid #30363d",
            background: "#0d1117",
            color: "#c9d1d9",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <input
          type="number"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder={currentPrice?.toFixed(2) || "0.00"}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: "4px",
            border: "1px solid #30363d",
            background: "#0d1117",
            color: "#c9d1d9",
            fontSize: "12px",
            fontFamily: "monospace",
            minWidth: 0,
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "6px",
          borderRadius: "4px",
          border: "none",
          background: "#f0883e",
          color: "#0d1117",
          fontSize: "12px",
          fontWeight: "bold",
          fontFamily: "monospace",
          cursor: "pointer",
        }}
      >
        {status === "success" ? "Alert Set!" : status === "error" ? "Failed" : "Create Alert"}
      </button>
    </form>
  );
}
