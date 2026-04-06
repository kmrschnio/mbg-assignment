type MessageHandler = (data: any) => void;

const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const WS_URL = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}/ws`;
const ALERT_WS_URL = import.meta.env.VITE_ALERT_WS_URL || `${wsProtocol}//${window.location.host}/ws/alerts`;
const RECONNECT_DELAY = 3000;

let ws: WebSocket | null = null;
let alertWs: WebSocket | null = null;
let handlers: MessageHandler[] = [];
let subscribedTickers: string[] = [];

export function connectWS(): void {
  connectMarketData();
  connectAlertEngine();
}

function connectMarketData(): void {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("[ws] market-data connected");
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
    console.log("[ws] market-data disconnected, reconnecting...");
    ws = null;
    setTimeout(connectMarketData, RECONNECT_DELAY);
  };

  ws.onerror = () => {
    ws?.close();
  };
}

function connectAlertEngine(): void {
  if (alertWs && alertWs.readyState === WebSocket.OPEN) return;

  alertWs = new WebSocket(ALERT_WS_URL);

  alertWs.onopen = () => {
    console.log("[ws] alert-engine connected");
  };

  alertWs.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      // alert messages go through the same handler pipeline
      for (const handler of handlers) {
        handler(msg);
      }
    } catch {
      // ignore
    }
  };

  alertWs.onclose = () => {
    console.log("[ws] alert-engine disconnected, reconnecting...");
    alertWs = null;
    setTimeout(connectAlertEngine, RECONNECT_DELAY);
  };

  alertWs.onerror = () => {
    alertWs?.close();
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
