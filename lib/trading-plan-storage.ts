import type { TradingPlan, TradingRule } from "@/types/trading-plan";

const STORAGE_KEY = "tradeflow_trading_plan";
const TRADING_PLAN_UPDATED_EVENT = "tradeflow:trading-plan-updated";

// تبدیل قوانین قدیمی متنی به ساختار جدید آرایه‌ای
function normalizeRules(value: unknown, prefix: string): TradingRule[] {
  if (Array.isArray(value)) {
    return value.filter(
      (rule): rule is TradingRule =>
        typeof rule === "object" &&
        rule !== null &&
        "id" in rule &&
        "text" in rule &&
        typeof rule.id === "string" &&
        typeof rule.text === "string",
    );
  }

  if (typeof value === "string" && value.trim()) {
    return [
      {
        id: `${prefix}-legacy`,
        text: value,
      },
    ];
  }

  return [];
}

// دریافت پلن معاملاتی
function parseTradingPlan(storedPlan: string): TradingPlan | null {
  try {
    const parsedPlan = JSON.parse(storedPlan);

    const normalizedPlan: TradingPlan = {
      ...parsedPlan,
      entryRules: normalizeRules(parsedPlan.entryRules, "entry"),
      buyConditions: normalizeRules(parsedPlan.buyConditions, "buy"),
      sellConditions: normalizeRules(parsedPlan.sellConditions, "sell"),
      noTradeRules: normalizeRules(parsedPlan.noTradeRules, "no-trade"),
      newsRules: normalizeRules(parsedPlan.newsRules, "news"),
    };

    return normalizedPlan;
  } catch (error) {
    console.error("Error loading trading plan:", error);
    return null;
  }
}

export function getTradingPlan(): TradingPlan | null {
  if (typeof window === "undefined") return null;

  try {
    const storedPlan = localStorage.getItem(STORAGE_KEY);

    if (!storedPlan) return null;

    return parseTradingPlan(storedPlan);
  } catch (error) {
    console.error("Error loading trading plan:", error);
    return null;
  }
}

// ذخیره پلن معاملاتی
export function saveTradingPlan(plan: TradingPlan): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));

    window.dispatchEvent(new Event(TRADING_PLAN_UPDATED_EVENT));
  } catch (error) {
    console.error("Error saving trading plan:", error);
  }
}

// حذف پلن معاملاتی
export function deleteTradingPlan(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);

    window.dispatchEvent(new Event(TRADING_PLAN_UPDATED_EVENT));
  } catch (error) {
    console.error("Error deleting trading plan:", error);
  }
}

export function subscribeTradingPlan(callback: () => void) {
  window.addEventListener(TRADING_PLAN_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(TRADING_PLAN_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getTradingPlanSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export const TRADING_PLAN_SERVER_SNAPSHOT = "__TRADEFLOW_SERVER_SNAPSHOT__";

export function getTradingPlanServerSnapshot(): string {
  return TRADING_PLAN_SERVER_SNAPSHOT;
}

export function parseTradingPlanSnapshot(
  snapshot: string | null,
): TradingPlan | null {
  if (!snapshot || snapshot === TRADING_PLAN_SERVER_SNAPSHOT) {
    return null;
  }

  return parseTradingPlan(snapshot);
}
