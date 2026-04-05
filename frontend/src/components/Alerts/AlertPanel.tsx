import { useAlertStore } from "../../stores/alertStore";

export function AlertPanel() {
  const alerts = useAlertStore((s) => s.alerts);

  if (alerts.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px 16px",
        background: "#161b22",
        borderRadius: "8px",
        border: "1px solid #30363d",
      }}
    >
      <h3 style={{ color: "#f0883e", fontSize: "13px", margin: "0 0 8px 0" }}>
        Alerts
      </h3>
      {alerts.slice(0, 5).map((alert) => (
        <div
          key={alert.id}
          style={{
            padding: "8px",
            marginBottom: "4px",
            borderRadius: "4px",
            background: "#1c2128",
            fontSize: "12px",
            color: "#c9d1d9",
          }}
        >
          <span style={{ color: "#f0883e", fontWeight: "bold" }}>{alert.ticker}</span>
          {" "}crossed {alert.condition} ${alert.threshold.toFixed(2)}
        </div>
      ))}
    </div>
  );
}
