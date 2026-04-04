import type { WebSocket } from "ws";
import type { WSServerMessage } from "@trading/shared";

export class SubscriptionManager {
  private subs = new Map<WebSocket, Set<string>>();

  subscribe(ws: WebSocket, tickers: string[]): void {
    if (!this.subs.has(ws)) {
      this.subs.set(ws, new Set());
    }
    const set = this.subs.get(ws)!;
    for (const t of tickers) {
      set.add(t);
    }
  }

  unsubscribe(ws: WebSocket, tickers: string[]): void {
    const set = this.subs.get(ws);
    if (!set) return;
    for (const t of tickers) {
      set.delete(t);
    }
  }

  removeClient(ws: WebSocket): void {
    this.subs.delete(ws);
  }

  broadcast(ticker: string, message: WSServerMessage): void {
    const raw = JSON.stringify(message);
    for (const [ws, tickers] of this.subs) {
      if (tickers.has(ticker) && ws.readyState === ws.OPEN) {
        ws.send(raw);
      }
    }
  }

  getClientCount(): number {
    return this.subs.size;
  }
}
