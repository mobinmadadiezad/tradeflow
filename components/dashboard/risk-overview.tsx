"use client";

import { ShieldCheck, ClipboardCheck, ChevronLeft } from "lucide-react";
import { useTrades } from "@/hooks/use-trades";
import { useAccount } from "@/hooks/use-account";
import { useSyncExternalStore } from "react";

import {
  subscribeTradingPlan,
  getTradingPlanSnapshot,
  getTradingPlanServerSnapshot,
  parseTradingPlanSnapshot,
} from "@/lib/trading-plan-storage";

type RiskOverviewProps = {
  onOpenChecklist: () => void;
};

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function RiskOverview({ onOpenChecklist }: RiskOverviewProps) {
  const { trades } = useTrades();
  const { account } = useAccount();

  const planSnapshot = useSyncExternalStore(
    subscribeTradingPlan,
    getTradingPlanSnapshot,
    getTradingPlanServerSnapshot,
  );

  const plan = parseTradingPlanSnapshot(planSnapshot);

  const today = getLocalDateKey(new Date());

  const todayTrades = trades.filter(
    (trade) => getLocalDateKey(new Date(trade.closeDate)) === today,
  );

  const maxDailyTrades = plan?.maxDailyTrades ?? 2;
  const riskPercent = plan?.riskPerTrade ?? 0.25;

  const maxRiskAmount = account.initialBalance * (riskPercent / 100);

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime(),
  );

  let consecutiveLosses = 0;

  for (const trade of sortedTrades) {
    if (trade.status === "LOSS") {
      consecutiveLosses += 1;
    } else {
      break;
    }
  }

  const dailyLimitReached = todayTrades.length >= maxDailyTrades;
  const lossLimitReached = consecutiveLosses >= 2;

  const riskBlocked = dailyLimitReached || lossLimitReached;

  const riskStatus = riskBlocked
    ? "محدودیت معاملاتی فعال است"
    : "وضعیت ریسک مطلوب";

  const riskDescription = lossLimitReached
    ? "دو معامله متوالی با ضرر بسته شده‌اند. طبق برنامه، معامله جدید انجام نده."
    : dailyLimitReached
      ? "به حداکثر تعداد معاملات امروز رسیده‌ای."
      : todayTrades.length === 0
        ? "هنوز معامله‌ای برای امروز ثبت نشده است. قبل از ورود، چک‌لیستت را بررسی کن."
        : "هنوز در محدوده مجاز معاملات روزانه قرار داری.";

  const progress = Math.min(
    (todayTrades.length / Math.max(maxDailyTrades, 1)) * 100,
    100,
  );

  return (
    <div className="panel">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">مدیریت ریسک</h3>
          <p className="mt-1 text-xs text-slate-500">وضعیت محدودیت‌های امروز</p>
        </div>

        <div
          className={`rounded-lg p-2 ${
            riskBlocked
              ? "bg-rose-400/10 text-rose-400"
              : "bg-emerald-400/10 text-emerald-400"
          }`}
        >
          <ShieldCheck size={19} />
        </div>
      </div>

      <div
        className={`rounded-xl border p-4 ${
          riskBlocked
            ? "border-rose-400/15 bg-rose-400/5"
            : "border-emerald-400/15 bg-emerald-400/5"
        }`}
      >
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            riskBlocked ? "text-rose-300" : "text-emerald-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              riskBlocked ? "bg-rose-400" : "bg-emerald-400"
            }`}
          />
          {riskStatus}
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          {riskDescription}
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">ریسک هر معامله</span>

            <span className="font-medium text-white" dir="ltr">
              {riskPercent}% / {riskPercent}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/6">
            <div className="h-full w-full rounded-full bg-cyan-400" />
          </div>

          <p className="mt-2 text-xs text-slate-500" dir="ltr">
            حداکثر ریسک برنامه‌ریزی‌شده: ${maxRiskAmount.toFixed(2)}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">معاملات امروز</span>

            <span className="font-medium text-white" dir="ltr">
              {todayTrades.length} از {maxDailyTrades}
            </span>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: maxDailyTrades }, (_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index < todayTrades.length ? "bg-cyan-400" : "bg-white/8"
                }`}
              />
            ))}
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">ضررهای متوالی</span>

            <span className="font-medium text-white" dir="ltr">
              {consecutiveLosses} / 2
            </span>
          </div>

          <div className="flex gap-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index < consecutiveLosses ? "bg-rose-400" : "bg-white/8"
                }`}
              />
            ))}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            پس از دو ضرر متوالی، معامله را متوقف کن.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenChecklist}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
      >
        <ClipboardCheck size={17} />
        بررسی چک‌لیست ورود
        <ChevronLeft size={16} className="mr-auto" />
      </button>
    </div>
  );
}
