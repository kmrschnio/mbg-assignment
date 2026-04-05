import express from "express";

const PORT = parseInt(process.env.AUTH_PORT || "3004", 10);

const app = express();
app.use(express.json());

// stub — will be implemented in bonus phase
app.post("/auth/login", (_req, res) => {
  res.status(501).json({ message: "Coming soon" });
});

app.get("/auth/verify", (_req, res) => {
  res.json({ valid: true, user: { id: "demo-user", role: "trader" } });
});

app.listen(PORT, () => {
  console.log(`[auth] listening on port ${PORT}`);
});
