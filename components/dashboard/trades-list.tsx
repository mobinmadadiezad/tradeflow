"use client";

import type { Trade } from "@/types/trade";
import { BookOpen, Plus, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import TradeDetailsModal from "@/components/dashboard/trade-details-modal";
import { Filter, ChevronDown, RotateCcw } from "lucide-react";
import GlobalLoader from "@/components/shared/global-loader";

type TradesListProps = {
  trades: Trade[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onAddTrade: () => void;
};

type DateFilter = "ALL" | "TODAY" | "WEEK" | "MONTH";

export default function TradesList({
  trades,
  isLoading,
  onDelete,
  onAddTrade,
}: TradesListProps) {
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL">("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "WIN" | "LOSS" | "BREAKEVEN"
  >("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeletingTradeId, setIsDeletingTradeId] = useState<string | null>(
    null,
  );

  const sortedTrades = [...trades].sort((a, b) => {
    return new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime();
  });

  const filteredTrades = sortedTrades.filter((trade) => {
    if (filter === "ALL") {
      return true;
    }

    return trade.direction === filter;
  });

  const now = new Date();

  const dateFilteredTrades = filteredTrades.filter((trade) => {
    const tradeDate = new Date(trade.closeDate);

    if (dateFilter === "ALL") return true;

    if (dateFilter === "TODAY") {
      return (
        tradeDate.getFullYear() === now.getFullYear() &&
        tradeDate.getMonth() === now.getMonth() &&
        tradeDate.getDate() === now.getDate()
      );
    }

    const daysAgo = new Date(now);

    if (dateFilter === "WEEK") {
      daysAgo.setDate(now.getDate() - 7);
    }

    if (dateFilter === "MONTH") {
      daysAgo.setDate(now.getDate() - 30);
    }

    return tradeDate >= daysAgo && tradeDate <= now;
  });

  const finalTrades = dateFilteredTrades.filter((trade) => {
    if (statusFilter === "ALL") {
      return true;
    }

    return trade.status === statusFilter;
  });

  const handleDeleteTrade = async (id: string) => {
    if (isDeletingTradeId) return;

    const confirmed = window.confirm(
      "آیا مطمئنی که می‌خواهی این معامله را حذف کنی؟",
    );

    if (!confirmed) return;

    try {
      setIsDeletingTradeId(id);

      // فرصت کوتاه برای نمایش لودینگ
      await new Promise((resolve) => setTimeout(resolve, 300));

      onDelete(id);
    } catch (error) {
      console.error("خطا در حذف معامله:", error);
      alert("حذف معامله با خطا مواجه شد.");
    } finally {
      setIsDeletingTradeId(null);
    }
  };

  if (isLoading) {
    return <GlobalLoader isLoading={true} message="LOADING TRADES..." />;
  }

  if (trades.length === 0) {
    return (
      <div className="flex min-h-87.5 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
          <BookOpen size={30} className="text-cyan-400" />
        </div>

        <h2 className="mb-2 text-lg font-semibold text-white">
          هنوز معامله‌ای ثبت نشده
        </h2>

        <p className="max-w-md text-sm leading-7 text-slate-400">
          بعد از انجام هر معامله، اطلاعاتی مثل نماد معاملاتی، نقطه ورود، حد ضرر،
          حد سود و نتیجه معامله رو اینجا ثبت کن.
        </p>

        <button
          onClick={onAddTrade}
          className="mt-6 flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
        >
          <Plus size={17} />
          اولین معامله‌ام را ثبت می‌کنم
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]">
      <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              isFilterOpen
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500/50"
            }`}
          >
            <Filter size={16} />
            فیلتر معاملات
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">تعداد معاملات:</span>
            <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-400">
              {finalTrades.length}
            </span>
          </div>
        </div>

        {/* Dropdown */}
        {isFilterOpen && (
          <div className="mt-4 grid gap-5 border-t border-slate-800 pt-4 md:grid-cols-2">
            {/* Direction */}
            <div>
              <p className="mb-3 text-xs font-medium text-slate-400">
                جهت معامله
              </p>

              <div className="flex flex-wrap gap-2">
                {(["ALL", "BUY", "SELL"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-3 py-2 text-xs transition ${
                      filter === item
                        ? "bg-cyan-500 text-slate-950"
                        : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
                    }`}
                  >
                    {item === "ALL"
                      ? "همه معاملات"
                      : item === "BUY"
                        ? "خرید"
                        : "فروش"}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <p className="mb-3 text-xs font-medium text-slate-400">
                بازه زمانی
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: "همه", value: "ALL" },
                  { label: "امروز", value: "TODAY" },
                  { label: "۷ روز اخیر", value: "WEEK" },
                  { label: "۳۰ روز اخیر", value: "MONTH" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDateFilter(item.value as DateFilter)}
                    className={`rounded-lg px-3 py-2 text-xs transition ${
                      dateFilter === item.value
                        ? "bg-cyan-500 text-slate-950"
                        : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="mb-3 text-xs font-medium text-slate-400">
                نتیجه معامله
              </p>

              <div className="flex flex-wrap gap-2">
                {(["ALL", "WIN", "LOSS", "BREAKEVEN"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStatusFilter(item)}
                    className={`rounded-lg px-3 py-2 text-xs transition ${
                      statusFilter === item
                        ? "bg-cyan-500 text-slate-950"
                        : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
                    }`}
                  >
                    {item === "ALL"
                      ? "همه نتایج"
                      : item === "WIN"
                        ? "سودده"
                        : item === "LOSS"
                          ? "ضررده"
                          : "سربه‌سر"}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilter("ALL");
                  setDateFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
              >
                <RotateCcw size={14} />
                پاک کردن فیلترها
              </button>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300 transition hover:bg-slate-700"
              >
                بستن
              </button>
            </div>
          </div>
        )}
      </div>

      <table className="w-full text-sm text-right">
        <thead className="border-b border-slate-800 bg-slate-900">
          <tr>
            <th className="px-4 py-4 text-slate-400">نماد</th>
            <th className="px-4 py-4 text-slate-400">جهت</th>
            <th className="px-4 py-4 text-slate-400">ورود</th>
            <th className="px-4 py-4 text-slate-400">خروج</th>
            <th className="px-4 py-4 text-slate-400">حد ضرر</th>
            <th className="px-4 py-4 text-slate-400">حد سود</th>
            <th className="px-4 py-4 text-slate-400">حجم</th>
            <th className="px-4 py-4 text-slate-400">سود / زیان</th>
            <th className="px-4 py-4 text-slate-400">نتیجه</th>
            <th className="px-4 py-4 text-slate-400">رعایت پلن</th>
            <th className="px-4 py-4 text-slate-400">تاریخ</th>
            <th className="px-4 py-4 text-slate-400">جزئیات</th>
            <th className="px-4 py-4 text-slate-400">عملیات</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {finalTrades.length === 0 ? (
            <tr>
              <td
                colSpan={13}
                className="px-4 py-12 text-center text-slate-400"
              >
                هیچ معامله‌ای با فیلترهای انتخاب‌شده پیدا نشد.
              </td>
            </tr>
          ) : (
            finalTrades.map((trade) => (
              <tr
                key={trade.id}
                className={`transition ${
                  trade.status === "WIN"
                    ? "bg-emerald-500/10 hover:bg-emerald-500/20"
                    : trade.status === "LOSS"
                      ? "bg-red-500/10 hover:bg-red-500/20"
                      : "bg-slate-500/10 hover:bg-slate-500/20"
                }`}
              >
                <td className="px-4 py-4 font-medium text-white">
                  {trade.symbol}
                </td>

                <td className="px-4 py-4">{trade.direction}</td>

                <td className="px-4 py-4 text-slate-300">{trade.entryPrice}</td>

                <td className="px-4 py-4 text-slate-300">{trade.exitPrice}</td>

                <td className="px-4 py-4 text-red-400">{trade.stopLoss}</td>

                <td className="px-4 py-4 text-emerald-400">
                  {trade.takeProfit}
                </td>

                <td className="px-4 py-4 text-slate-300">{trade.volume}</td>

                <td
                  className={`px-4 py-4 font-semibold ${
                    trade.profitLoss > 0
                      ? "text-emerald-400"
                      : trade.profitLoss < 0
                        ? "text-red-400"
                        : "text-slate-400"
                  }`}
                >
                  {trade.profitLoss > 0 ? "+" : ""}
                  {trade.profitLoss.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  $
                </td>

                <td className="px-4 py-4">{trade.status}</td>

                <td className="px-4 py-4">
                  <span
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                      trade.planCompliance === "FOLLOWED"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : trade.planCompliance === "NOT_FOLLOWED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {trade.planCompliance === "FOLLOWED"
                      ? "مطابق پلن"
                      : trade.planCompliance === "NOT_FOLLOWED"
                        ? "خارج از پلن"
                        : "بررسی‌نشده"}
                  </span>
                </td>

                <td className="px-4 py-4 text-slate-400">{trade.closeDate}</td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedTrade(trade)}
                    className="rounded-lg p-2 text-cyan-400 transition hover:bg-cyan-500/10 hover:text-cyan-300"
                    title="مشاهده جزئیات"
                  >
                    <Eye size={17} />
                  </button>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => handleDeleteTrade(trade.id)}
                    disabled={isDeletingTradeId !== null}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    title="حذف معامله"
                  >
                    {isDeletingTradeId === trade.id ? (
                      <span className="block h-4.25 w-4.25 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedTrade && (
        <TradeDetailsModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </div>
  );
}
