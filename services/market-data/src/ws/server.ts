import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import type { WSClientMessage } from "@trading/shared";
import { TICKER_SYMBOLS } from "@trading/shared";
import { SubscriptionManager } from "./subscriptions.js";

export function createWSServer(port: number): {
  wss: WebSocketServer;
  subscriptions: SubscriptionManager;
} {
  const wss = new WebSocketServer({ port });
  const subscriptions = new SubscriptionManager();

  wss.on("connection", (ws: WebSocket) => {
    console.log(`[ws] client connected (total: ${subscriptions.getClientCount() + 1})`);

    ws.on("message", (raw: Buffer) => {
      try {
        const msg: WSClientMessage = JSON.parse(raw.toString());
        handleMessage(ws, msg, subscriptions);
      } catch {
        ws.send(JSON.stringify({ type: "error", payload: { message: "invalid message" } }));
      }
    });

    ws.on("close", () => {
      subscriptions.removeClient(ws);
      console.log(`[ws] client disconnected (total: ${subscriptions.getClientCount()})`);
    });
  });

  console.log(`[ws] server listening on port ${port}`);
  return { wss, subscriptions };
}

function handleMessage(
  ws: WebSocket,
  msg: WSClientMessage,
  subscriptions: SubscriptionManager
): void {
  const validTickers = msg.payload.tickers.filter((t) =>
    TICKER_SYMBOLS.includes(t)
  );

  switch (msg.type) {
    case "subscribe":
      subscriptions.subscribe(ws, validTickers);
      break;
    case "unsubscribe":
      subscriptions.unsubscribe(ws, validTickers);
      break;
  }
}
