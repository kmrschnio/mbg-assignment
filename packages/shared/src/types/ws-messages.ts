import type { Tick } from "./tick.js";
import type { Alert } from "./alert.js";

export interface SubscribeMessage {
  type: "subscribe";
  payload: { tickers: string[] };
}

export interface UnsubscribeMessage {
  type: "unsubscribe";
  payload: { tickers: string[] };
}

export interface TickMessage {
  type: "tick";
  payload: Tick;
}

export interface AlertMessage {
  type: "alert";
  payload: Alert;
}

export type WSClientMessage = SubscribeMessage | UnsubscribeMessage;
export type WSServerMessage = TickMessage | AlertMessage;
export type WSMessage = WSClientMessage | WSServerMessage;
