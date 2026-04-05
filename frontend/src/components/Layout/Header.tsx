export function Header() {
  return (
    <header
      style={{
        padding: "12px 24px",
        background: "#161b22",
        borderBottom: "1px solid #30363d",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "20px" }}>📈</span>
        <h1
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#f0f6fc",
            fontFamily: "monospace",
          }}
        >
          Trading Dashboard
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          color: "#3fb950",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#3fb950",
            display: "inline-block",
          }}
        />
        Live
      </div>
    </header>
  );
}
