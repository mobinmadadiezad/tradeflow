"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CircleAlert,
  ShieldCheck,
  Target,
} from "lucide-react";

type TradeDirection = "buy" | "sell";

const DEFAULT_BALANCE = 2000;
const DEFAULT_RISK_PERCENT = 0.25;

// فقط یک فرض اولیه برای نمایش محاسبه حجم است.
// قبل از استفاده واقعی باید با مشخصات قرارداد بروکر تطبیق داده شود.
const ASSUMED_LOT_SIZE = 100;

export default function RiskCalculator() {
  const [direction, setDirection] = useState<TradeDirection>("buy");
  const [balance, setBalance] = useState(String(DEFAULT_BALANCE));
  const [riskPercent, setRiskPercent] = useState(
    String(DEFAULT_RISK_PERCENT),
  );
  const [entry, setEntry] = useState("4000");
  const [stopLoss, setStopLoss] = useState("3995");
  const [takeProfit, setTakeProfit] = useState("4010");

  const result = useMemo(() => {
    const accountBalance = Number(balance);
    const riskRate = Number(riskPercent);
    const entryPrice = Number(entry);
    const slPrice = Number(stopLoss);
    const tpPrice = Number(takeProfit);

    const inputs = [
      accountBalance,
      riskRate,
      entryPrice,
      slPrice,
      tpPrice,
    ];

    if (
      inputs.some((value) => !Number.isFinite(value)) ||
      accountBalance <= 0 ||
      riskRate <= 0 ||
      riskRate > 100 ||
      entryPrice <= 0 ||
      slPrice <= 0 ||
      tpPrice <= 0
    ) {
      return { valid: false as const, reason: "invalid" as const };
    }

    const validStops =
      direction === "buy"
        ? slPrice < entryPrice && tpPrice > entryPrice
        : slPrice > entryPrice && tpPrice < entryPrice;

    if (!validStops) {
      return { valid: false as const, reason: "prices" as const };
    }

    const stopDistance = Math.abs(entryPrice - slPrice);
    const targetDistance = Math.abs(tpPrice - entryPrice);

    const riskAmount = accountBalance * (riskRate / 100);
    const rewardAmount =
      riskAmount * (targetDistance / stopDistance);

    // فرض: هر لات استاندارد XAUUSD برابر 100 اونس است.
    // این مقدار باید با مشخصات نماد در بروکر بررسی شود.
    const estimatedLot =
      riskAmount / (stopDistance * ASSUMED_LOT_SIZE);

    return {
      valid: true as const,
      stopDistance,
      targetDistance,
      riskAmount,
      rewardAmount,
      rewardRisk: targetDistance / stopDistance,
      estimatedLot,
    };
  }, [balance, riskPercent, entry, stopLoss, takeProfit, direction]);

  const numberInputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#080d17] px-3 py-3 text-left text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60";

  return (
    <section dir="rtl" className="panel">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300">
              <Calculator size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              ماشین‌حساب ریسک
            </h2>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            محاسبه ریسک و سود احتمالی پیش از ورود به معامله
          </p>
        </div>

        <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-400/15 bg-emerald-400/6 px-3 py-2 text-xs text-emerald-300 sm:flex">
          <ShieldCheck size={15} />
          مدیریت ریسک
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setDirection("buy")}
          className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
            direction === "buy"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 bg-white/2 text-slate-400 hover:bg-white/4"
          }`}
        >
          <ArrowUpRight size={17} />
          خرید (Buy)
        </button>

        <button
          type="button"
          onClick={() => setDirection("sell")}
          className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
            direction === "sell"
              ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
              : "border-white/10 bg-white/2 text-slate-400 hover:bg-white/4"
          }`}
        >
          <ArrowDownRight size={17} />
          فروش (Sell)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-400">
          موجودی حساب (دلار)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            step="any"
            value={balance}
            onChange={(event) => setBalance(event.target.value)}
            dir="ltr"
            placeholder="2000"
          />
        </label>

        <label className="text-sm text-slate-400">
          ریسک هر معامله (درصد)
          <input
            className={numberInputClass}
            type="number"
            min="0.01"
            max="100"
            step="any"
            value={riskPercent}
            onChange={(event) => setRiskPercent(event.target.value)}
            dir="ltr"
            placeholder="0.25"
          />
        </label>

        <label className="text-sm text-slate-400">
          قیمت ورود
          <input
            className={numberInputClass}
            type="number"
            min="0"
            step="any"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            dir="ltr"
            placeholder="4000"
          />
        </label>

        <label className="text-sm text-slate-400">
          حد ضرر (SL)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            step="any"
            value={stopLoss}
            onChange={(event) => setStopLoss(event.target.value)}
            dir="ltr"
            placeholder="3995"
          />
        </label>

        <label className="text-sm text-slate-400 sm:col-span-2">
          حد سود (TP)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            step="any"
            value={takeProfit}
            onChange={(event) => setTakeProfit(event.target.value)}
            dir="ltr"
            placeholder="4010"
          />
        </label>
      </div>

      {!result.valid && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/6 p-3 text-sm text-rose-300">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <p>
            {result.reason === "prices"
              ? direction === "buy"
                ? "برای خرید، حد ضرر باید پایین‌تر از ورود و حد سود بالاتر از ورود باشد."
                : "برای فروش، حد ضرر باید بالاتر از ورود و حد سود پایین‌تر از ورود باشد."
              : "مقادیر را بررسی کن. موجودی و قیمت‌ها باید مثبت و درصد ریسک بیشتر از صفر و حداکثر ۱۰۰ باشد."}
          </p>
        </div>
      )}

      {result.valid && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-rose-400/15 bg-rose-400/5 p-4">
              <p className="text-xs text-slate-400">زیان احتمالی در حد ضرر</p>
              <p className="mt-2 text-2xl font-semibold text-rose-300" dir="ltr">
                {result.riskAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {result.stopDistance.toFixed(2)} دلار فاصله تا حد ضرر
              </p>
            </div>

            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4">
              <p className="text-xs text-slate-400">سود احتمالی در حد سود</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300" dir="ltr">
                {result.rewardAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {result.targetDistance.toFixed(2)} دلار فاصله تا حد سود
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.07] bg-white/2 p-4">
              <p className="text-xs text-slate-400">نسبت سود به زیان</p>
              <p className="mt-2 text-xl font-semibold text-white" dir="ltr">
                1 : {result.rewardRisk.toFixed(2)}
              </p>
              <p
                className={`mt-2 text-xs ${
                  result.rewardRisk >= 2
                    ? "text-emerald-400"
                    : "text-amber-300"
                }`}
              >
                {result.rewardRisk >= 2
                  ? "هدف حداقل ۱:۲ تأمین شده است."
                  : "نسبت کمتر از هدف ۱:۲ است."}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/2 p-4">
              <p className="text-xs text-slate-400">
                حجم تخمینی (لات استاندارد)
              </p>
              <p className="mt-2 text-xl font-semibold text-white" dir="ltr">
                {result.estimatedLot.toFixed(3)}
              </p>
              <p className="mt-2 text-xs leading-5 text-amber-300">
                فرض محاسبه: ۱ لات = ۱۰۰ اونس. پیش از استفاده، مشخصات بروکر را
                بررسی کن.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/4 p-3 text-xs leading-6 text-slate-400">
            <Target size={17} className="mt-1 shrink-0 text-cyan-300" />
            <p>
              محاسبات بر اساس قیمت‌های واردشده است. اسپرد، کمیسیون، لغزش قیمت و
              حداقل حجم مجاز بروکر ممکن است نتیجه واقعی را تغییر دهند. حجم
              تخمینی را تا زمان تأیید مشخصات قرارداد برای اجرای معامله استفاده
              نکن.
            </p>
          </div>
        </>
      )}
    </section>
  );
}