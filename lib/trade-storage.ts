import type { Trade } from "@/types/trade";

const STORAGE_KEY = "tradeflow_trades";
const TRADES_UPDATED_EVENT = "tradeflow:trades-updated";

// دریافت تمام معاملات
export function getTrades(): Trade[] {
  if (typeof window === "undefined") return [];

  try {
    const storedTrades = localStorage.getItem(STORAGE_KEY);

    if (!storedTrades) return [];

    return JSON.parse(storedTrades) as Trade[];
  } catch (error) {
    console.error("Error loading trades:", error);
    return [];
  }
}

// ذخیره تمام معاملات
export function saveTrades(trades: Trade[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));

    window.dispatchEvent(new Event(TRADES_UPDATED_EVENT));
  } catch (error) {
    console.error("Error saving trades:", error);
  }
}

// افزودن معامله جدید
export function addTrade(trade: Trade): void {
  const trades = getTrades();
  saveTrades([trade, ...trades]);
}

// حذف معامله
export function deleteTrade(id: string): void {
  const trades = getTrades();
  saveTrades(trades.filter((trade) => trade.id !== id));
}

// اشتراک در تغییرات معاملات
export function subscribeTrades(callback: () => void) {
  window.addEventListener(TRADES_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(TRADES_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// دریافت Snapshot معاملات
export function getTradesSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

// Snapshot مخصوص رندر سمت سرور
export function getTradesServerSnapshot(): null {
  return null;
}