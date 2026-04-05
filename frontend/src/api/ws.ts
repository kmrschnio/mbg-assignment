type MessageHandler = (data: any) => void;

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3001";
const RECONNECT_DELAY = 3000;

let ws: WebSocket | null = null;
let handlers: MessageHandler[] = [];
let subscribedTickers: string[] = [];

export function connectWS(): void {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("[ws] connected");
    // re-subscribe after reconnect
    if (subscribedTickers.length > 0) {
      sendSubscribe(subscribedTickers);
    }
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      for (const handler of handlers) {
        handler(msg);
      }
    } catch {
      // ignore
    }
  };

  ws.onclose = () => {
    console.log("[ws] disconnected, reconnecting...");
    ws = null;
    setTimeout(connectWS, RECONNECT_DELAY);
  };

  ws.onerror = () => {
    ws?.close();
  };
}

export function addMessageHandler(handler: MessageHandler): () => void {
  handlers.push(handler);
  return () => {
    handlers = handlers.filter((h) => h !== handler);
  };
}

export function sendSubscribe(tickers: string[]): void {
  subscribedTickers = [...new Set([...subscribedTickers, ...tickers])];
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "subscribe", payload: { tickers } }));
  }
}

export function sendUnsubscribe(tickers: string[]): void {
  subscribedTickers = subscribedTickers.filter((t) => !tickers.includes(t));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "unsubscribe", payload: { tickers } }));
  }
}
