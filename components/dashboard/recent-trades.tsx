"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  Clock3,
} from "lucide-react";

import { useTrades } from "@/hooks/use-trades";
import { calculateNetProfitLoss } from "@/lib/account-analytics";

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(value);

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "تاریخ نامعتبر";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

type RecentTradesProps = {
  onOpenJournal: () => void;
};

export default function RecentTrades({ onOpenJournal }: RecentTradesProps) {
  const { trades } = useTrades();

  const recentTrades = [...trades]
    .sort(
      (a, b) =>
        new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="panel mb-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">آخرین معاملات</h3>

          <p className="mt-1 text-xs text-slate-500">
            مرور سریع نتایج معاملات اخیر
          </p>
        </div>

        <button
          onClick={onOpenJournal}
          className="flex items-center gap-1 text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
        >
          مشاهده ژورنال
          <ChevronLeft size={15} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-right text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-xs text-slate-500">
              <th className="pb-4 pl-4 font-medium">شناسه</th>
              <th className="px-4 pb-4 font-medium">نماد</th>
              <th className="px-4 pb-4 font-medium">نوع</th>
              <th className="px-4 pb-4 font-medium">قیمت ورود</th>
              <th className="px-4 pb-4 font-medium">قیمت خروج</th>
              <th className="px-4 pb-4 font-medium">زمان</th>
              <th className="pb-4 pr-4 text-left font-medium">نتیجه خالص</th>
            </tr>
          </thead>

          <tbody>
            {recentTrades.length > 0 ? (
              recentTrades.map((trade) => {
                const netResult = calculateNetProfitLoss(trade);
                const isBuy = trade.direction === "BUY";

                return (
                  <tr
                    key={trade.id}
                    className="border-b border-white/4.5 last:border-0 transition hover:bg-white/2"
                  >
                    <td
                      className="py-4 pl-4 font-mono text-xs text-slate-500"
                      dir="ltr"
                    >
                      {trade.id}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2" dir="ltr">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/15 bg-amber-400/8 text-[10px] font-bold text-amber-300">
                          AU
                        </span>

                        <span className="font-semibold text-slate-200">
                          {trade.symbol}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
                          isBuy
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-rose-400/10 text-rose-400"
                        }`}
                      >
                        {isBuy ? (
                          <ArrowUpRight size={13} />
                        ) : (
                          <ArrowDownRight size={13} />
                        )}

                        {isBuy ? "خرید" : "فروش"}
                      </span>
                    </td>

                    <td
                      className="px-4 py-4 font-mono text-xs text-slate-300"
                      dir="ltr"
                    >
                      {formatPrice(trade.entryPrice)}
                    </td>

                    <td
                      className="px-4 py-4 font-mono text-xs text-slate-300"
                      dir="ltr"
                    >
                      {formatPrice(trade.exitPrice)}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {formatDate(trade.closeDate)}
                      </span>
                    </td>

                    <td className="py-4 pr-4 text-left font-semibold" dir="ltr">
                      <span
                        className={
                          netResult > 0
                            ? "text-emerald-400"
                            : netResult < 0
                              ? "text-rose-400"
                              : "text-slate-400"
                        }
                      >
                        {netResult > 0 ? "+" : ""}
                        {formatUsd(netResult)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-slate-500"
                >
                  هنوز معامله‌ای ثبت نشده است.
                  <p className="mt-2 text-xs">
                    پس از ثبت اولین معامله، اطلاعات آن اینجا نمایش داده می‌شود.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-4">
        <p className="text-xs text-slate-500">
          نمایش {recentTrades.length} معامله از {trades.length} معامله
        </p>

        <button
          onClick={onOpenJournal}
          className="flex items-center gap-1 text-xs text-cyan-300 transition hover:text-cyan-200"
        >
          مشاهده همه
          <ChevronLeft size={15} />
        </button>
      </div>
    </section>
  );
}
