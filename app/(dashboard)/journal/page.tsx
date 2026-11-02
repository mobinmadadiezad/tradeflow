"use client";
import { useState, useSyncExternalStore } from "react";
import { Activity, Plus } from "lucide-react";
import { useTrades } from "@/hooks/use-trades";
import {
  subscribeTradingPlan,
  getTradingPlanSnapshot,
  getTradingPlanServerSnapshot,
  parseTradingPlanSnapshot,
} from "@/lib/trading-plan-storage";
import AddTradeForm from "@/components/dashboard/add-trade-form";
import TradesList from "@/components/dashboard/trades-list";

export default function JournalPage() {
  const { trades, createTrade, removeTrade, isLoading } = useTrades();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const planSnapshot = useSyncExternalStore(
    subscribeTradingPlan,
    getTradingPlanSnapshot,
    getTradingPlanServerSnapshot,
  );

  const plan = parseTradingPlanSnapshot(planSnapshot);

  const todayTradeCount = trades.filter((trade) => {
    const tradeDate = new Date(trade.openDate);
    const today = new Date();

    return (
      tradeDate.getFullYear() === today.getFullYear() &&
      tradeDate.getMonth() === today.getMonth() &&
      tradeDate.getDate() === today.getDate()
    );
  }).length;

  const maxDailyTrades = plan?.maxDailyTrades ?? 0;

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Activity className="text-cyan-400" size={26} />

            <h1 className="text-2xl font-bold text-white">ژورنال معاملات</h1>
          </div>

          <p className="text-sm text-slate-400">
            تاریخچه معاملاتت رو ثبت کن و عملکردت رو بررسی کن.
          </p>

          <p className="mt-3 text-sm text-cyan-400">
            تعداد معاملات ثبت‌شده: {trades.length}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Plus size={18} />
          ثبت معامله جدید
        </button>
      </div>

      {/* Trades List */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">معاملات ثبت‌شده</h2>

          <p className="mt-1 text-sm text-gray-400">
            تاریخچه معاملات معاملاتی شما
          </p>
        </div>

        <TradesList
          trades={trades}
          onDelete={removeTrade}
          onAddTrade={() => setIsFormOpen(true)}
          isLoading={isLoading}
        />
      </div>

      {isFormOpen && (
        <AddTradeForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={createTrade}
          todayTradeCount={todayTradeCount}
          maxDailyTrades={maxDailyTrades}
        />
      )}
    </section>
  );
}
