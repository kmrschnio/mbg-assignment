import { useAuthStore } from "../../stores/authStore";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

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
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
        {user && (
          <>
            <span style={{ color: "#8b949e", fontSize: "13px" }}>
              {user.id}
            </span>
            <button
              onClick={logout}
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                border: "1px solid #30363d",
                background: "transparent",
                color: "#8b949e",
                fontSize: "12px",
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
