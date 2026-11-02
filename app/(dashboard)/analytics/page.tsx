"use client";

import { useState } from "react";
import { useTrades } from "@/hooks/use-trades";
import {
  calculateTradeStats,
  calculateDailyPerformance,
  calculateBestAndWorstDay,
} from "@/lib/trade-analytics";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
} from "lucide-react";
import PerformanceChart from "@/components/dashboard/performance-chart";
import GlobalLoader from "@/components/shared/global-loader";

type DateFilter = "ALL" | "TODAY" | "WEEK" | "MONTH";

export default function AnalyticsPage() {
const { trades, isLoading } = useTrades();
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");

  const now = new Date();

  const filteredTrades = trades.filter((trade) => {
    if (dateFilter === "ALL") return true;

    const tradeDate = new Date(`${trade.closeDate.slice(0, 10)}T00:00:00`);

    if (Number.isNaN(tradeDate.getTime())) return false;

    if (dateFilter === "TODAY") {
      return tradeDate.toDateString() === now.toDateString();
    }

    const daysAgo = new Date(now);
    daysAgo.setHours(0, 0, 0, 0);

    if (dateFilter === "WEEK") {
      daysAgo.setDate(daysAgo.getDate() - 7);
    }

    if (dateFilter === "MONTH") {
      daysAgo.setDate(daysAgo.getDate() - 30);
    }

    return tradeDate >= daysAgo && tradeDate <= now;
  });

  const tradeStats = calculateTradeStats(filteredTrades);
  const dailyPerformance = calculateDailyPerformance(filteredTrades);
  const { bestDay, worstDay } = calculateBestAndWorstDay(filteredTrades);
  const stats = [
    {
      title: "نرخ برد",
      value: `${tradeStats.winRate.toFixed(1)}%`,
      description: `${tradeStats.winningTrades} معامله سودده`,
      icon: Target,
    },
    {
      title: "سود خالص",
      value: `${tradeStats.netProfitLoss.toFixed(2)}$`,
      description: "مجموع سود و زیان",
      icon: TrendingUp,
    },
    {
      title: "تعداد معاملات",
      value: String(tradeStats.totalTrades),
      description: `${tradeStats.losingTrades} معامله ضررده`,
      icon: Activity,
    },
    {
      title: "میانگین R:R",
      value:
        tradeStats.averageRiskReward > 0
          ? `1:${tradeStats.averageRiskReward.toFixed(0)}`
          : "—",
      description: "میانگین نسبت ریسک به ریوارد",
      icon: TrendingDown,
    },
  ];

  if (isLoading) {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

        <GlobalLoader isLoading={true} message=" در حال بارگذاری اطلاعات معاملات..." />
      </div>
    </div>
  );
}

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <BarChart3 size={26} className="text-cyan-400" />

          <h1 className="text-2xl font-bold text-white">تحلیل عملکرد</h1>
        </div>

        <p className="text-sm text-slate-400">
          عملکرد معاملاتی خودت رو بررسی و نقاط ضعف و قوتت رو شناسایی کن.
        </p>
      </div>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "همه معاملات", value: "ALL" },
          { label: "امروز", value: "TODAY" },
          { label: "۷ روز اخیر", value: "WEEK" },
          { label: "۳۰ روز اخیر", value: "MONTH" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setDateFilter(item.value as DateFilter)}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              dateFilter === item.value
                ? "bg-cyan-500 text-slate-950"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-slate-400">{stat.title}</span>

                <div className="rounded-xl bg-cyan-500/10 p-2.5">
                  <Icon size={19} className="text-cyan-400" />
                </div>
              </div>

              <p
                className={`text-2xl font-bold ${
                  stat.title === "سود خالص"
                    ? tradeStats.netProfitLoss >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                    : "text-white"
                }`}
              >
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Best & Worst Trading Days */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Best Day */}
        <div className="rounded-2xl border border-emerald-500 bg-emerald-900/60 p-5">
          <p className="mb-3 text-sm text-slate-400">بهترین روز معاملاتی</p>

          <p className="text-2xl font-bold text-emerald-400">
            {bestDay ? `+$${bestDay.profitLoss.toFixed(2)}` : "—"}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {bestDay ? bestDay.date : "هنوز داده‌ای وجود ندارد"}
          </p>
        </div>

        {/* Worst Day */}
        <div className="rounded-2xl border border-red-500 bg-red-900/60 p-5">
          <p className="mb-3 text-sm text-slate-400">بدترین روز معاملاتی</p>

          <p className="text-2xl font-bold text-red-400">
            {worstDay ? `$${worstDay.profitLoss.toFixed(2)}` : "—"}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {worstDay ? worstDay.date : "هنوز داده‌ای وجود ندارد"}
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">
          نمودار عملکرد معاملاتی
        </h2>

        <p className="mb-6 text-sm text-slate-400">
          تغییرات سود و زیان معاملات بر اساس تاریخ بسته‌شدن.
        </p>

        {dailyPerformance.length > 0 ? (
          <PerformanceChart data={dailyPerformance} />
        ) : (
          <div className="flex min-h-70 flex-col items-center justify-center text-center">
            <BarChart3 size={42} className="mb-4 text-slate-600" />
            <p className="text-sm text-slate-500">
              هنوز داده‌ای برای تحلیل وجود ندارد.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
