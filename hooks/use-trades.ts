"use client";

import { useSyncExternalStore } from "react";
import type { Trade } from "@/types/trade";
import {
  addTrade,
  deleteTrade,
  getTradesSnapshot,
  getTradesServerSnapshot,
  subscribeTrades,
} from "@/lib/trade-storage";

export function useTrades() {
  const tradesSnapshot = useSyncExternalStore(
    subscribeTrades,
    getTradesSnapshot,
    getTradesServerSnapshot,
  );

  const trades: Trade[] = JSON.parse(tradesSnapshot);

  const createTrade = (trade: Trade) => {
    addTrade(trade);
  };

  const removeTrade = (id: string) => {
    deleteTrade(id);
  };

  return {
    trades,
    isLoading: false,
    createTrade,
    removeTrade,
  };
}