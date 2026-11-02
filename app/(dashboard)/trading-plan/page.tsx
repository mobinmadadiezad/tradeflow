"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ClipboardCheck,
  ShieldCheck,
  Clock,
  Target,
  TrendingUp,
  Save,
} from "lucide-react";
import type { TradingPlan } from "@/types/trading-plan";
import {
  saveTradingPlan,
  subscribeTradingPlan,
  getTradingPlanSnapshot,
  getTradingPlanServerSnapshot,
  parseTradingPlanSnapshot,
  TRADING_PLAN_SERVER_SNAPSHOT,
} from "@/lib/trading-plan-storage";
import TradingRulesEditor from "@/components/dashboard/trading-rules-editor";
import GlobalLoader from "@/components/shared/global-loader";

// مقادیر اولیه پلن
const defaultPlan: TradingPlan = {
  symbol: "XAUUSD",
  analysisTimeframe: "M15",
  confirmationTimeframe: "M5",

  riskPerTrade: 0.5,
  maxDailyTrades: 2,
  minRiskReward: 2,

  tradingSession: "",

  entryRules: [],
  buyConditions: [],
  sellConditions: [],
  noTradeRules: [],
  newsRules: [],
};

export default function TradingPlanPage() {
  const [draftPlan, setDraftPlan] = useState<TradingPlan | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const planSnapshot = useSyncExternalStore(
    subscribeTradingPlan,
    getTradingPlanSnapshot,
    getTradingPlanServerSnapshot,
  );

  const storedPlan = parseTradingPlanSnapshot(planSnapshot);

  const plan = draftPlan ?? storedPlan ?? defaultPlan;

  const isLoaded = planSnapshot !== TRADING_PLAN_SERVER_SNAPSHOT;

  // بررسی تکمیل بخش‌های پلن
  const completedSections = [
    Boolean(
      plan.symbol.trim() &&
      plan.analysisTimeframe.trim() &&
      plan.confirmationTimeframe.trim(),
    ),

    plan.riskPerTrade > 0 && plan.maxDailyTrades > 0 && plan.minRiskReward > 0,

    plan.entryRules.length > 0,

    plan.buyConditions.length > 0,

    plan.sellConditions.length > 0,

    plan.noTradeRules.length > 0,

    plan.newsRules.length > 0,
  ];

  const completedCount = completedSections.filter(Boolean).length;

  const totalSections = completedSections.length;

  const completionPercentage = Math.round(
    (completedCount / totalSections) * 100,
  );

  // تغییر اطلاعات فرم
  const handleChange = (
    field: keyof TradingPlan,
    value: TradingPlan[keyof TradingPlan],
  ) => {
    setDraftPlan((prev) => ({
      ...(prev ?? plan),
      [field]: value,
    }));

    setIsSaved(false);
  };

  // ذخیره پلن
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    if (
      !plan.symbol.trim() ||
      !plan.analysisTimeframe.trim() ||
      !plan.confirmationTimeframe.trim()
    ) {
      alert("لطفاً اطلاعات اصلی پلن را تکمیل کن.");
      return;
    }

    if (
      !Number.isFinite(plan.riskPerTrade) ||
      plan.riskPerTrade <= 0 ||
      plan.riskPerTrade > 100
    ) {
      alert("درصد ریسک باید بیشتر از صفر و حداکثر ۱۰۰ باشد.");
      return;
    }

    if (!Number.isInteger(plan.maxDailyTrades) || plan.maxDailyTrades < 1) {
      alert("حداکثر معاملات روزانه باید یک عدد صحیح مثبت باشد.");
      return;
    }

    if (!Number.isFinite(plan.minRiskReward) || plan.minRiskReward <= 0) {
      alert("نسبت ریسک به بازده باید بیشتر از صفر باشد.");
      return;
    }

    try {
      setIsSaving(true);
      setIsSaved(false);

      await new Promise((resolve) => setTimeout(resolve, 400));

      saveTradingPlan(plan);
      setDraftPlan(null);
      setIsSaved(true);
    } catch (error) {
      console.error("خطا در ذخیره پلن:", error);
      alert("ذخیره پلن با خطا مواجه شد.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <GlobalLoader
        isLoading={true}
        message=" در حال بارگذاری پلن معاملاتی..."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
            <ClipboardCheck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">پلن معاملاتی</h1>

            <p className="mt-1 text-sm text-slate-400">
              مدیریت استراتژی و قوانین معاملاتی
            </p>
          </div>
        </div>
      </div>

      {/* Trading Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
          <TrendingUp className="mb-4 text-cyan-300" />

          <p className="text-sm text-slate-400">نماد معاملاتی</p>

          <h3 className="mt-2 text-xl font-bold text-white">{plan.symbol}</h3>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
          <Clock className="mb-4 text-cyan-300" />

          <p className="text-sm text-slate-400">تایم‌فریم تأیید</p>

          <h3 className="mt-2 text-xl font-bold text-white">
            {plan.confirmationTimeframe}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
          <ShieldCheck className="mb-4 text-cyan-300" />

          <p className="text-sm text-slate-400">ریسک هر معامله</p>

          <h3 className="mt-2 text-xl font-bold text-white">
            {plan.riskPerTrade}%
          </h3>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
          <Target className="mb-4 text-cyan-300" />

          <p className="text-sm text-slate-400">حداکثر معاملات روزانه</p>

          <h3 className="mt-2 text-xl font-bold text-white">
            {plan.maxDailyTrades}
          </h3>
        </div>
      </div>

      {/* Plan Completion */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">وضعیت تکمیل پلن</h2>

            <p className="mt-1 text-sm text-slate-400">
              {completedCount} از {totalSections} بخش تکمیل شده
            </p>
          </div>

          <span
            className={`text-lg font-bold ${
              completionPercentage === 100 ? "text-green-400" : "text-cyan-300"
            }`}
          >
            {completionPercentage}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completionPercentage === 100 ? "bg-green-400" : "bg-cyan-400"
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {completionPercentage === 100
            ? "تمام بخش‌های پلن تکمیل شده‌اند."
            : "برای تکمیل پلن، بخش‌های باقی‌مانده را بررسی کن."}
        </p>
      </div>

      {/* Trading Plan Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Settings */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6">
          <h2 className="mb-6 text-lg font-bold text-white">تنظیمات اصلی</h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                نماد معاملاتی
              </label>

              <input
                value={plan.symbol}
                onChange={(e) => handleChange("symbol", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                تایم‌فریم تحلیل
              </label>

              <input
                value={plan.analysisTimeframe}
                onChange={(e) =>
                  handleChange("analysisTimeframe", e.target.value)
                }
                placeholder="مثلاً M15"
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                تایم‌فریم تأیید ورود
              </label>

              <input
                value={plan.confirmationTimeframe}
                onChange={(e) =>
                  handleChange("confirmationTimeframe", e.target.value)
                }
                placeholder="مثلاً M5"
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                ریسک هر معامله (درصد)
              </label>

              <input
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={plan.riskPerTrade}
                onChange={(e) =>
                  handleChange("riskPerTrade", Number(e.target.value))
                }
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                حداکثر معاملات روزانه
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={plan.maxDailyTrades}
                onChange={(e) =>
                  handleChange("maxDailyTrades", Number(e.target.value))
                }
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                حداقل نسبت ریسک به بازده
              </label>

              <input
                type="number"
                min="0.1"
                step="0.1"
                value={plan.minRiskReward}
                onChange={(e) =>
                  handleChange("minRiskReward", Number(e.target.value))
                }
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                ساعت مجاز معامله
              </label>

              <input
                value={plan.tradingSession}
                onChange={(e) => handleChange("tradingSession", e.target.value)}
                placeholder="مثلاً 16:00 تا 21:00"
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Trading Rules */}
        <div className="space-y-6">
          <TradingRulesEditor
            title="قوانین عمومی ورود"
            description="شرط‌هایی که قبل از هر معامله، چه BUY و چه SELL، باید رعایت شوند."
            rules={plan.entryRules}
            onChange={(rules) => handleChange("entryRules", rules)}
          />

          <TradingRulesEditor
            title="شرایط ورود BUY"
            description="شرط‌های اختصاصی ورود به معامله خرید."
            rules={plan.buyConditions}
            onChange={(rules) => handleChange("buyConditions", rules)}
          />

          <TradingRulesEditor
            title="شرایط ورود SELL"
            description="شرط‌های اختصاصی ورود به معامله فروش."
            rules={plan.sellConditions}
            onChange={(rules) => handleChange("sellConditions", rules)}
          />

          <TradingRulesEditor
            title="قوانین عدم معامله"
            description="شرایطی که در صورت وجود آن‌ها نباید وارد معامله شوی."
            rules={plan.noTradeRules}
            onChange={(rules) => handleChange("noTradeRules", rules)}
          />

          <TradingRulesEditor
            title="قوانین اخبار اقتصادی"
            description="شرط‌های مربوط به اخبار مهم و زمان‌هایی که باید از معامله دور بمانی."
            rules={plan.newsRules}
            onChange={(rules) => handleChange("newsRules", rules)}
          />
        </div>

        {/* Save Button */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save size={18} />
                ذخیره پلن معاملاتی
              </>
            )}
          </button>

          {isSaved && (
            <span className="text-sm text-green-400">
              پلن معاملاتی با موفقیت ذخیره شد.
            </span>
          )}
        </div>
      </form>

      {/* Trading Rules Overview */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6">
        <h2 className="mb-6 text-lg font-bold text-white">
          خلاصه قوانین معاملاتی
        </h2>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center justify-between border-b border-white/6 pb-4">
            <span>حداکثر معاملات روزانه</span>
            <span className="font-semibold text-cyan-300">
              {plan.maxDailyTrades} معامله
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/6 pb-4">
            <span>ریسک هر معامله</span>
            <span className="font-semibold text-cyan-300">
              {plan.riskPerTrade} درصد
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/6 pb-4">
            <span>حداقل نسبت ریسک به بازده</span>
            <span className="font-semibold text-cyan-300">
              1:{plan.minRiskReward}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>تایم‌فریم تأیید</span>
            <span className="font-semibold text-cyan-300">
              {plan.confirmationTimeframe}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
