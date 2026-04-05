import express from "express";
import cors from "cors";
import { sign, verify } from "./jwt.js";

const PORT = parseInt(process.env.AUTH_PORT || "3004", 10);

// hardcoded demo users for the coding challenge
const USERS: Record<string, { password: string; role: string }> = {
  trader1: { password: "password123", role: "trader" },
  admin: { password: "admin123", role: "admin" },
};

const app = express();
app.use(cors());
app.use(express.json());

/** POST /auth/login — returns JWT token */
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "username and password required" });
    return;
  }

  const user = USERS[username];
  if (!user || user.password !== password) {
    res.status(401).json({ error: "invalid credentials" });
    return;
  }

  const token = sign({ userId: username, role: user.role });
  res.json({ token, user: { id: username, role: user.role } });
});

/** GET /auth/verify — validates JWT from Authorization header */
app.get("/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "missing token" });
    return;
  }

  try {
    const payload = verify(authHeader.slice(7));
    res.json({ valid: true, user: { id: payload.userId, role: payload.role } });
  } catch {
    res.status(401).json({ valid: false, error: "invalid or expired token" });
  }
});

app.listen(PORT, () => {
  console.log(`[auth] listening on port ${PORT}`);
});
