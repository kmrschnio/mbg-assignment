import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(username, password);
    setLoading(false);

    if (!success) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: "monospace",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "40px",
          width: "360px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span style={{ fontSize: "32px" }}>📈</span>
          <h1 style={{ color: "#f0f6fc", fontSize: "20px", margin: "8px 0 4px" }}>
            Trading Dashboard
          </h1>
          <p style={{ color: "#8b949e", fontSize: "13px", margin: 0 }}>
            Sign in to continue
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#c9d1d9", fontSize: "13px", marginBottom: "6px" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="trader1"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #30363d",
              background: "#0d1117",
              color: "#c9d1d9",
              fontSize: "14px",
              fontFamily: "monospace",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#c9d1d9", fontSize: "13px", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password123"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #30363d",
              background: "#0d1117",
              color: "#c9d1d9",
              fontSize: "14px",
              fontFamily: "monospace",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div style={{ color: "#f85149", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background: "#58a6ff",
            color: "#0d1117",
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: "monospace",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ color: "#8b949e", fontSize: "11px", textAlign: "center", marginTop: "16px" }}>
          Demo: trader1 / password123
        </p>
      </form>
    </div>
  );
}
