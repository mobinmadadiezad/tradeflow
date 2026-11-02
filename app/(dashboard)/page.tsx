"use client";

import { useState } from "react";
import { BarChart3, CalendarDays, ChevronDown, Plus } from "lucide-react";

import DashboardStats from "@/components/dashboard/dashboard-stats";
import PerformanceChart from "@/components/dashboard/performance-chart";
import RiskOverview from "@/components/dashboard/risk-overview";
import RiskCalculator from "@/components/dashboard/risk-calculator";
import RecentTrades from "@/components/dashboard/recent-trades";
import { useTrades } from "@/hooks/use-trades";
import { calculateDailyPerformance } from "@/lib/trade-analytics";

export default function Home() {
  const [period, setPeriod] = useState("۳۰ روز اخیر");
  const { trades } = useTrades();
  const dailyPerformance = calculateDailyPerformance(trades);

  return (
    <>
      <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">
              نمای کلی بازار و عملکرد
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            داشبورد معاملاتی
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            خلاصه‌ای از عملکرد، معاملات و مدیریت ریسک تو.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/6">
            <CalendarDays size={16} className="text-slate-400" />

            <select
              aria-label="بازه زمانی"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="cursor-pointer bg-transparent outline-none"
            >
              <option className="bg-[#0b111e]" value="۷ روز اخیر">
                ۷ روز اخیر
              </option>

              <option className="bg-[#0b111e]" value="۳۰ روز اخیر">
                ۳۰ روز اخیر
              </option>

              <option className="bg-[#0b111e]" value="۹۰ روز اخیر">
                ۹۰ روز اخیر
              </option>
            </select>

            <ChevronDown size={14} />
          </button>

          <button
            onClick={() => {
              // در مرحله‌های بعد، این دکمه به فرم ثبت معامله متصل می‌شود.
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-300"
          >
            <Plus size={17} />
            ثبت معامله
          </button>
        </div>
      </section>

      <DashboardStats />

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
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

        <RiskOverview
          onOpenChecklist={() => {
            // اتصال به صفحه چک‌لیست را بعداً پیاده‌سازی می‌کنیم.
          }}
        />
      </section>

      <RecentTrades
        onOpenJournal={() => {
          // اتصال به ژورنال را بعداً پیاده‌سازی می‌کنیم.
        }}
      />

      <RiskCalculator />

      <footer className="flex flex-col items-center justify-between gap-3 py-4 text-xs text-slate-600 sm:flex-row">
        <p>© 2026 TradeFlow. ساخته‌شده برای نظم بیشتر در معامله‌گری.</p>

        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          نسخه اولیه — اطلاعات نمایش‌داده‌شده نمونه هستند.
        </p>
      </footer>
    </>
  );
}
