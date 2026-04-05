import express from "express";
import cors from "cors";

const PORT = parseInt(process.env.ALERT_ENGINE_PORT || "3003", 10);

const app = express();
app.use(cors());
app.use(express.json());

// stub routes — will be implemented in bonus phase
app.post("/alerts", (_req, res) => {
  res.status(501).json({ message: "Coming soon" });
});

app.get("/alerts", (_req, res) => {
  res.json([]);
});

app.delete("/alerts/:id", (_req, res) => {
  res.status(501).json({ message: "Coming soon" });
});

app.listen(PORT, () => {
  console.log(`[alert-engine] listening on port ${PORT}`);
});
