import { useEffect } from "react";
import { connectWS, addMessageHandler, sendSubscribe } from "../api/ws";
import { usePriceStore } from "../stores/priceStore";
import { useAlertStore } from "../stores/alertStore";

export function useWebSocket(tickers: string[]): void {
  const updateTick = usePriceStore((s) => s.updateTick);
  const addAlert = useAlertStore((s) => s.addAlert);

  useEffect(() => {
    connectWS();

    const removeHandler = addMessageHandler((msg) => {
      switch (msg.type) {
        case "tick":
          updateTick(msg.payload);
          break;
        case "alert":
          addAlert(msg.payload);
          break;
      }
    });

    return removeHandler;
  }, [updateTick, addAlert]);

  useEffect(() => {
    if (tickers.length > 0) {
      sendSubscribe(tickers);
    }
  }, [tickers]);
}
