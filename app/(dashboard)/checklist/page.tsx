"use client";

import { useState, useSyncExternalStore } from "react";
import { ShieldCheck } from "lucide-react";

import {
  subscribeTradingPlan,
  getTradingPlanSnapshot,
  getTradingPlanServerSnapshot,
  parseTradingPlanSnapshot,
  TRADING_PLAN_SERVER_SNAPSHOT,
} from "@/lib/trading-plan-storage";

import ChecklistSection from "@/components/dashboard/checklist-section";
import NoTradeChecklist from "@/components/dashboard/no-trade-checklist";
import NewsChecklist from "@/components/dashboard/news-checklist";

import {
  saveChecklistState,
  saveActiveBlocks,
  type ChecklistState,
  saveActiveNews,
  subscribeChecklist,
  getChecklistSnapshot,
  getActiveBlocksSnapshot,
  getActiveNewsSnapshot,
  getChecklistServerSnapshot,
} from "@/lib/checklist-storage";

type TradeDirection = "BUY" | "SELL";

export default function ChecklistPage() {
  // پلن معاملاتی ذخیره‌شده
  const planSnapshot = useSyncExternalStore(
    subscribeTradingPlan,
    getTradingPlanSnapshot,
    getTradingPlanServerSnapshot,
  );

  const storedPlan = parseTradingPlanSnapshot(planSnapshot);
  const isPlanLoaded = planSnapshot !== TRADING_PLAN_SERVER_SNAPSHOT;

  // وضعیت ذخیره‌شده چک‌لیست
  const checkedRulesSnapshot = useSyncExternalStore(
    subscribeChecklist,
    getChecklistSnapshot,
    getChecklistServerSnapshot,
  );

  const activeBlocksSnapshot = useSyncExternalStore(
    subscribeChecklist,
    getActiveBlocksSnapshot,
    getChecklistServerSnapshot,
  );

  const activeNewsSnapshot = useSyncExternalStore(
    subscribeChecklist,
    getActiveNewsSnapshot,
    getChecklistServerSnapshot,
  );

  const checkedRules: ChecklistState = JSON.parse(checkedRulesSnapshot);
  const activeBlocks: ChecklistState = JSON.parse(activeBlocksSnapshot);
  const activeNews: ChecklistState = JSON.parse(activeNewsSnapshot);

  const [direction, setDirection] = useState<TradeDirection>("BUY");

  const plan = storedPlan;

  const isLoaded = isPlanLoaded;

  const handleToggle = (id: string) => {
    const updatedState = {
      ...checkedRules,
      [id]: !checkedRules[id],
    };

    saveChecklistState(updatedState);
  };

  const handleBlockToggle = (id: string) => {
    const updatedState = {
      ...activeBlocks,
      [id]: !activeBlocks[id],
    };

    saveActiveBlocks(updatedState);
  };

  const handleNewsToggle = (id: string) => {
    const updatedState = {
      ...activeNews,
      [id]: !activeNews[id],
    };

    saveActiveNews(updatedState);
  };

  if (!isLoaded) {
    return (
      <div className="text-center text-slate-400">
        در حال بارگذاری چک‌لیست...
      </div>
    );
  }

  if (!plan) {
    return (
      <section className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <p className="text-yellow-400">
          ابتدا پلن معاملاتی خود را ایجاد و ذخیره کن.
        </p>
      </section>
    );
  }

  const directionRules =
    direction === "BUY" ? plan.buyConditions : plan.sellConditions;

  const requiredEntryRules = [...plan.entryRules, ...directionRules];

  const completedCount = requiredEntryRules.filter(
    (rule) => checkedRules[rule.id],
  ).length;

  const totalRules = requiredEntryRules.length;

  const completionPercentage =
    totalRules > 0 ? Math.round((completedCount / totalRules) * 100) : 0;

  const allEntryRulesCompleted =
    totalRules > 0 && completedCount === totalRules;

  const activeBlockCount = plan.noTradeRules.filter(
    (rule) => activeBlocks[rule.id],
  ).length;

  const hasActiveBlock = activeBlockCount > 0;

  const activeNewsCount = plan.newsRules.filter(
    (rule) => activeNews[rule.id],
  ).length;

  const hasActiveNews = activeNewsCount > 0;

  const isReadyForEntry =
    allEntryRulesCompleted && !hasActiveBlock && !hasActiveNews;

  return (
    <section className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <ShieldCheck className="text-cyan-400" size={26} />

          <h1 className="text-2xl font-bold text-white">
            چک‌لیست ورود به معامله
          </h1>
        </div>

        <p className="text-sm text-slate-400">
          قبل از ورود به هر معامله، تمام شرایط پلن را بررسی کن.
        </p>
      </div>

      {/* وضعیت تکمیل */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">
              وضعیت چک‌لیست {plan.symbol}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {completedCount} از {totalRules} شرط تأیید شده
            </p>
          </div>

          <span className="text-xl font-bold text-cyan-300">
            {completionPercentage}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* انتخاب جهت */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
        <h2 className="mb-4 font-bold text-white">جهت معامله را انتخاب کن</h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDirection("BUY")}
            className={`rounded-xl border p-4 font-bold transition ${
              direction === "BUY"
                ? "border-green-400 bg-green-400/10 text-green-400"
                : "border-white/10 text-slate-400"
            }`}
          >
            BUY / خرید
          </button>

          <button
            type="button"
            onClick={() => setDirection("SELL")}
            className={`rounded-xl border p-4 font-bold transition ${
              direction === "SELL"
                ? "border-red-400 bg-red-400/10 text-red-400"
                : "border-white/10 text-slate-400"
            }`}
          >
            SELL / فروش
          </button>
        </div>
      </div>

      {/* شروط ورود */}
      <div className="space-y-4">
        <ChecklistSection
          title="قوانین عمومی ورود"
          description="شرایط مشترک تمام معاملات."
          rules={plan.entryRules}
          checkedRules={checkedRules}
          onToggle={handleToggle}
        />

        <ChecklistSection
          title={`شرایط ورود ${direction}`}
          description="شرایط اختصاصی جهت انتخاب‌شده."
          rules={directionRules}
          checkedRules={checkedRules}
          onToggle={handleToggle}
        />
      </div>

      {/* موانع معامله */}
      <NoTradeChecklist
        rules={plan.noTradeRules}
        activeBlocks={activeBlocks}
        onToggle={handleBlockToggle}
      />

      <NewsChecklist
        rules={plan.newsRules}
        activeNews={activeNews}
        onToggle={handleNewsToggle}
      />

      {/* وضعیت نهایی */}
      <div
        className={`rounded-2xl border p-5 ${
          isReadyForEntry
            ? "border-green-400/20 bg-green-400/5"
            : "border-red-400/20 bg-red-400/5"
        }`}
      >
        <h2
          className={`font-bold ${
            isReadyForEntry ? "text-green-400" : "text-red-400"
          }`}
        >
          {isReadyForEntry
            ? `چک‌لیست ${direction} کامل شده است`
            : "چک‌لیست هنوز کامل نیست"}
        </h2>

        <p className="mt-2 text-sm leading-7 text-slate-400">
          {hasActiveBlock
            ? `${activeBlockCount} مانع معاملاتی فعال وجود دارد.`
            : hasActiveNews
              ? `${activeNewsCount} مانع خبری فعال است.`
              : !allEntryRulesCompleted
                ? "تمام شروط عمومی و اختصاصی ورود را بررسی و تأیید کن."
                : "تمام شروط چک‌لیست بررسی شده‌اند."}
        </p>

        {isReadyForEntry && (
          <p className="mt-3 text-sm font-medium text-green-300">
            چک‌لیست طبق پلن تکمیل شده است؛ تصمیم نهایی با معامله‌گر است. تکمیل
            چک‌لیست تضمین‌کننده سود نیست.
          </p>
        )}
      </div>
    </section>
  );
}
