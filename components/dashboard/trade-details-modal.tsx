"use client";

import type { Trade } from "@/types/trade";
import { X, TrendingUp, TrendingDown, Calendar, FileText } from "lucide-react";

type TradeDetailsModalProps = {
  trade: Trade;
  onClose: () => void;
};

export default function TradeDetailsModal({
  trade,
  onClose,
}: TradeDetailsModalProps) {
  const isWin = trade.status === "WIN";
  const isLoss = trade.status === "LOSS";

  const details = [
    { label: "نماد معاملاتی", value: trade.symbol },
    {
      label: "جهت معامله",
      value: trade.direction === "BUY" ? "خرید (BUY)" : "فروش (SELL)",
    },
    { label: "قیمت ورود", value: trade.entryPrice },
    { label: "قیمت خروج", value: trade.exitPrice },
    { label: "حد ضرر (SL)", value: trade.stopLoss },
    { label: "حد سود (TP)", value: trade.takeProfit },
    { label: "حجم معامله", value: `${trade.volume} Lot` },
    {
      label: "نتیجه",
      value: isWin ? "سودده" : isLoss ? "ضررده" : "سربه‌سر",
    },
    {
      label: "رعایت پلن",
      value:
        trade.planCompliance === "FOLLOWED"
          ? "مطابق پلن"
          : trade.planCompliance === "NOT_FOLLOWED"
            ? "خارج از پلن"
            : "بررسی‌نشده",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">جزئیات معامله</h2>
            <p className="mt-1 text-sm text-slate-400">
              اطلاعات کامل معامله ثبت‌شده
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="بستن"
          >
            <X size={21} />
          </button>
        </div>

        <div
          className={`mb-6 rounded-xl border p-4 ${
            isWin
              ? "border-emerald-500/20 bg-emerald-500/10"
              : isLoss
                ? "border-red-500/20 bg-red-500/10"
                : "border-slate-500/20 bg-slate-500/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">سود / زیان معامله</p>
              <p
                className={`mt-2 text-2xl font-bold ${
                  isWin
                    ? "text-emerald-400"
                    : isLoss
                      ? "text-red-400"
                      : "text-slate-300"
                }`}
              >
                {trade.profitLoss > 0 ? "+" : ""}
                {trade.profitLoss.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </p>
            </div>

            {isWin ? (
              <TrendingUp size={30} className="text-emerald-400" />
            ) : isLoss ? (
              <TrendingDown size={30} className="text-red-400" />
            ) : (
              <ActivityIcon />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {details.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/[0.07] bg-slate-900/60 p-4"
            >
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-2 font-semibold text-slate-200">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.07] bg-slate-900/60 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calendar size={17} className="text-cyan-400" />
            <h3 className="font-semibold text-white">زمان معامله</h3>
          </div>

          <p className="text-sm text-slate-300">
            باز شدن: {trade.openDate.replace("T", " ")}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            بسته شدن: {trade.closeDate.replace("T", " ")}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.07] bg-slate-900/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileText size={17} className="text-cyan-400" />
            <h3 className="font-semibold text-white">توضیحات معامله</h3>
          </div>

          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {trade.notes.trim() || "توضیحی برای این معامله ثبت نشده است."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          بستن جزئیات
        </button>
      </div>
    </div>
  );
}

function ActivityIcon() {
  return <Calendar size={30} className="text-slate-400" />;
}
