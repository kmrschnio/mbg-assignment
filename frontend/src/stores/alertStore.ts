import { create } from "zustand";

export interface Alert {
  id: string;
  ticker: string;
  condition: "above" | "below";
  threshold: number;
  triggered: boolean;
  triggeredAt?: number;
}

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => {
      // deduplicate by id
      if (state.alerts.some((a) => a.id === alert.id)) return state;
      return { alerts: [alert, ...state.alerts].slice(0, 50) };
    }),
  clearAlerts: () => set({ alerts: [] }),
}));
