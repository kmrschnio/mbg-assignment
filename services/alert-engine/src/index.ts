import express from "express";
import cors from "cors";
import WebSocket from "ws";
import { TICKER_SYMBOLS } from "@trading/shared";
import { evaluate } from "./evaluator/threshold.js";
import { createAlert, getAlerts, getActiveAlerts, triggerAlert, deleteAlert } from "./store/rules.js";

const PORT = parseInt(process.env.ALERT_ENGINE_PORT || "3003", 10);
const MARKET_DATA_WS = process.env.MARKET_DATA_WS || "ws://localhost:3001";

const app = express();
app.use(cors());
app.use(express.json());

// --- REST routes ---

app.post("/alerts", (req, res) => {
  const { ticker, condition, threshold } = req.body;

  if (!ticker || !condition || threshold == null) {
    res.status(400).json({ error: "ticker, condition, and threshold are required" });
    return;
  }

  if (!TICKER_SYMBOLS.includes(ticker)) {
    res.status(400).json({ error: `unknown ticker: ${ticker}` });
    return;
  }

  if (!["above", "below"].includes(condition)) {
    res.status(400).json({ error: "condition must be 'above' or 'below'" });
    return;
  }

  const alert = createAlert(ticker, condition, threshold);
  res.status(201).json(alert);
});

app.get("/alerts", (_req, res) => {
  res.json(getAlerts());
});

app.delete("/alerts/:id", (req, res) => {
  const deleted = deleteAlert(req.params.id);
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "alert not found" });
  }
});

// --- WebSocket connection to market-data for tick evaluation ---

// connected frontend clients for push notifications
const frontendClients = new Set<WebSocket>();

const wss = new WebSocket.Server({ noServer: true });

function connectToMarketData() {
  const ws = new WebSocket(MARKET_DATA_WS);

  ws.on("open", () => {
    console.log("[alert-engine] connected to market-data");
    ws.send(JSON.stringify({ type: "subscribe", payload: { tickers: TICKER_SYMBOLS } }));
  });

  ws.on("message", (raw: Buffer) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "tick") {
        const { ticker, price } = msg.payload;

        for (const alert of getActiveAlerts()) {
          if (alert.ticker !== ticker) continue;

          if (evaluate({ ticker: alert.ticker, condition: alert.condition, threshold: alert.threshold }, price)) {
            const triggered = triggerAlert(alert.id);
            if (triggered) {
              console.log(`[alert-engine] triggered: ${ticker} ${alert.condition} ${alert.threshold} (price: ${price})`);

              // push to connected frontend clients
              const alertMsg = JSON.stringify({ type: "alert", payload: triggered });
              for (const client of frontendClients) {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(alertMsg);
                }
              }
            }
          }
        }
      }
    } catch {
      // ignore
    }
  });

  ws.on("close", () => {
    console.log("[alert-engine] disconnected from market-data, reconnecting...");
    setTimeout(connectToMarketData, 3000);
  });

  ws.on("error", () => {});
}

const server = app.listen(PORT, () => {
  console.log(`[alert-engine] listening on port ${PORT}`);
  connectToMarketData();
});

// handle WebSocket upgrade for frontend alert push
server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    frontendClients.add(ws);
    ws.on("close", () => frontendClients.delete(ws));
  });
});
