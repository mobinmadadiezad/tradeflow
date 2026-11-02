"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Trade, TradeStatus, PlanCompliance } from "@/types/trade";

type AddTradeFormProps = {
  onClose: () => void;
  onSubmit: (trade: Trade) => void;
  todayTradeCount: number;
  maxDailyTrades: number;
};

export default function AddTradeForm({
  onClose,
  onSubmit,
  todayTradeCount,
  maxDailyTrades,
}: AddTradeFormProps) {
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [allowOverLimit, setAllowOverLimit] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "XAUUSD",
    direction: "BUY",
    entryPrice: "",
    exitPrice: "",
    stopLoss: "",
    takeProfit: "",
    volume: "",
    openDate: "",
    closeDate: "",
    notes: "",
    profitLoss: "",
    planCompliance: "NOT_CHECKED" as PlanCompliance,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!formData.entryPrice || !formData.exitPrice) {
      alert("لطفاً قیمت ورود و خروج را وارد کنید.");
      return false;
    }

    if (!formData.stopLoss || !formData.takeProfit) {
      alert("لطفاً حد ضرر و حد سود را وارد کنید.");
      return false;
    }

    if (!formData.volume || Number(formData.volume) <= 0) {
      alert("حجم معامله باید بیشتر از صفر باشد.");
      return false;
    }

    if (formData.profitLoss.trim() === "") {
      alert("لطفاً مقدار سود یا زیان را وارد کنید.");
      return false;
    }

    if (!formData.openDate || !formData.closeDate) {
      alert("لطفاً تاریخ باز و بسته شدن معامله را وارد کنید.");
      return false;
    }

    if (new Date(formData.closeDate) < new Date(formData.openDate)) {
      alert("تاریخ بسته شدن نمی‌تواند قبل از تاریخ باز شدن باشد.");
      return false;
    }

    const entry = Number(formData.entryPrice);
    const stopLoss = Number(formData.stopLoss);
    const takeProfit = Number(formData.takeProfit);

    if (
      !Number.isFinite(entry) ||
      !Number.isFinite(stopLoss) ||
      !Number.isFinite(takeProfit) ||
      entry <= 0 ||
      stopLoss <= 0 ||
      takeProfit <= 0
    ) {
      alert("قیمت ورود، حد ضرر و حد سود باید اعداد معتبر و مثبت باشند.");
      return false;
    }

    if (formData.direction === "BUY") {
      if (stopLoss >= entry) {
        alert("در معامله BUY، حد ضرر باید پایین‌تر از قیمت ورود باشد.");
        return false;
      }

      if (takeProfit <= entry) {
        alert("در معامله BUY، حد سود باید بالاتر از قیمت ورود باشد.");
        return false;
      }
    }

    if (formData.direction === "SELL") {
      if (stopLoss <= entry) {
        alert("در معامله SELL، حد ضرر باید بالاتر از قیمت ورود باشد.");
        return false;
      }

      if (takeProfit >= entry) {
        alert("در معامله SELL، حد سود باید پایین‌تر از قیمت ورود باشد.");
        return false;
      }
    }

    const volume = Number(formData.volume);

    if (!Number.isFinite(volume) || volume <= 0) {
      alert("حجم معامله باید عددی معتبر و بزرگ‌تر از صفر باشد.");
      return false;
    }

    const profitLoss = Number(formData.profitLoss);

    if (!Number.isFinite(profitLoss)) {
      alert("مقدار سود یا زیان واردشده معتبر نیست.");
      return false;
    }

    const exitPrice = Number(formData.exitPrice);

    if (!Number.isFinite(exitPrice) || exitPrice <= 0) {
      alert("قیمت خروج باید عددی معتبر و بزرگ‌تر از صفر باشد.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // جلوگیری از ثبت چندباره
    if (isSubmitting) return;

    const isValid = validateForm();

    if (!isValid) return;

    if (
      maxDailyTrades > 0 &&
      todayTradeCount >= maxDailyTrades &&
      !allowOverLimit
    ) {
      setShowLimitWarning(true);
      return;
    }

    const profitLoss = Number(formData.profitLoss);

    let status: TradeStatus;

    if (profitLoss > 0) {
      status = "WIN";
    } else if (profitLoss < 0) {
      status = "LOSS";
    } else {
      status = "BREAKEVEN";
    }

    const newTrade: Trade = {
      id: crypto.randomUUID(),

      symbol: formData.symbol,
      direction: formData.direction as "BUY" | "SELL",

      entryPrice: Number(formData.entryPrice),
      exitPrice: Number(formData.exitPrice),
      stopLoss: Number(formData.stopLoss),
      takeProfit: Number(formData.takeProfit),

      volume: Number(formData.volume),

      profitLoss,
      status,

      openDate: formData.openDate,
      closeDate: formData.closeDate,

      notes: formData.notes,
      planCompliance: formData.planCompliance,
    };

    try {
      setIsSubmitting(true);

      // شبیه‌سازی کوتاه عملیات ذخیره
      await new Promise((resolve) => setTimeout(resolve, 400));

      onSubmit(newTrade);
      onClose();
    } catch (error) {
      console.error("خطا در ثبت معامله:", error);
      alert("ثبت معامله با خطا مواجه شد. لطفاً دوباره تلاش کن.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl h-4/5 overflow-auto rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">ثبت معامله جدید</h2>

            <p className="mt-1 text-sm text-gray-400">
              اطلاعات معامله خود را وارد کنید.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Symbol */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                نماد معاملاتی
              </label>

              <input
                type="text"
                value="XAUUSD"
                readOnly
                className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Direction */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                جهت معامله
              </label>

              <select
                value={formData.direction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    direction: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              >
                <option value="BUY">خرید (BUY)</option>
                <option value="SELL">فروش (SELL)</option>
              </select>
            </div>

            {/* Entry Price */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                قیمت ورود
              </label>

              <input
                type="number"
                step="any"
                value={formData.entryPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    entryPrice: e.target.value,
                  })
                }
                placeholder="مثلاً 4000.50"
                className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Exit Price */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                قیمت خروج
              </label>

              <input
                type="number"
                step="any"
                value={formData.exitPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exitPrice: e.target.value,
                  })
                }
                placeholder="مثلاً 4010.50"
                className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                حد ضرر (SL)
              </label>

              <input
                type="number"
                step="any"
                value={formData.stopLoss}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stopLoss: e.target.value,
                  })
                }
                placeholder="قیمت حد ضرر"
                className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Take Profit */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                حد سود (TP)
              </label>

              <input
                type="number"
                step="any"
                value={formData.takeProfit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    takeProfit: e.target.value,
                  })
                }
                placeholder="قیمت حد سود"
                className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              />
            </div>

            {/* Volume */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                حجم معامله (Lot)
              </label>

              <input
                type="number"
                step="any"
                value={formData.volume}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    volume: e.target.value,
                  })
                }
                placeholder="مثلاً 0.01"
                className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
              />
            </div>
          </div>

          {/* Open Date */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              تاریخ باز شدن معامله
            </label>

            <input
              type="datetime-local"
              value={formData.openDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  openDate: e.target.value,
                })
              }
              className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
            />
          </div>

          {/* Close Date */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              تاریخ بسته شدن معامله
            </label>

            <input
              type="datetime-local"
              value={formData.closeDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  closeDate: e.target.value,
                })
              }
              className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
            />
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">
              توضیحات معامله
            </label>

            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              placeholder="دلیل ورود، تحلیل بازار و نتیجه معامله..."
              className="w-full resize-none rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
            />
          </div>

          {/* Plan Compliance */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">
              آیا معامله مطابق پلن معاملاتی بود؟
            </label>

            <select
              value={formData.planCompliance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  planCompliance: e.target.value as PlanCompliance,
                })
              }
              className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
            >
              <option value="NOT_CHECKED">بررسی نشده</option>
              <option value="FOLLOWED">بله، مطابق پلن بود</option>
              <option value="NOT_FOLLOWED">خیر، خارج از پلن بود</option>
            </select>

            <p className="mt-2 text-xs text-gray-500">
              بر اساس شرایط زمان ورود به معامله، وضعیت را انتخاب کن.
            </p>
          </div>

          {/* Profit / Loss */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              سود یا زیان (USD)
            </label>

            <input
              type="number"
              step="any"
              value={formData.profitLoss}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profitLoss: e.target.value,
                })
              }
              placeholder="مثلاً 15 یا -10"
              className="w-full rounded-lg border border-white/10 bg-[#1f2937] px-4 py-3 text-white outline-none"
            />
          </div>

          {showLimitWarning && (
            <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
              <p className="text-sm font-semibold text-amber-300">
                به سقف معاملات روزانه رسیده‌ای!
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                امروز {todayTradeCount} معامله ثبت کرده‌ای و سقف پلن تو{" "}
                {maxDailyTrades} معامله است. اگر همچنان می‌خواهی این معامله را
                ثبت کنی، ادامه را تأیید کن.
              </p>

              <button
                type="button"
                onClick={() => {
                  setAllowOverLimit(true);
                  setShowLimitWarning(false);
                }}
                className="mt-3 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                تأیید و ادامه ثبت معامله
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isSubmitting ? "در حال ثبت معامله..." : "ثبت معامله"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
