import type { Trade } from "@/types/trade";

const STORAGE_KEY = "tradeflow_trades";
const TRADES_UPDATED_EVENT = "tradeflow:trades-updated";

// سازگاری با معاملات قدیمی
function normalizeTrade(trade: Partial<Trade>): Trade {
  return {
    ...trade,
    commission: Number(trade.commission ?? 0),
    swap: Number(trade.swap ?? 0),
  } as Trade;
}

// دریافت و استانداردسازی تمام معاملات
export function getTrades(): Trade[] {
  if (typeof window === "undefined") return [];

  try {
    const storedTrades = localStorage.getItem(STORAGE_KEY);

    if (!storedTrades) return [];

    const parsedTrades = JSON.parse(storedTrades);

    if (!Array.isArray(parsedTrades)) return [];

    return parsedTrades.map((trade) => normalizeTrade(trade));
  } catch (error) {
    console.error("Error loading trades:", error);
    return [];
  }
}

// ذخیره تمام معاملات
export function saveTrades(trades: Trade[]): void {
  if (typeof window === "undefined") return;

  try {
    const normalizedTrades = trades.map((trade) => normalizeTrade(trade));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedTrades));

    window.dispatchEvent(new Event(TRADES_UPDATED_EVENT));
  } catch (error) {
    console.error("Error saving trades:", error);
  }
}

// افزودن معامله جدید
export function addTrade(trade: Trade): void {
  const trades = getTrades();

  saveTrades([normalizeTrade(trade), ...trades]);
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
export function getTradesSnapshot(): string {
  if (typeof window === "undefined") return "[]";

  try {
    const storedTrades = localStorage.getItem(STORAGE_KEY);

    if (!storedTrades) return "[]";

    const parsedTrades = JSON.parse(storedTrades);

    if (!Array.isArray(parsedTrades)) return "[]";

    return JSON.stringify(parsedTrades.map((trade) => normalizeTrade(trade)));
  } catch (error) {
    console.error("Error creating trades snapshot:", error);
    return "[]";
  }
}

// Snapshot مخصوص رندر سمت سرور
export function getTradesServerSnapshot(): string {
  return "[]";
}
