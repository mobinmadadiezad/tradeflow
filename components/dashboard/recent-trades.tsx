"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";

const trades = [
  {
    id: "#TF-024",
    symbol: "XAUUSD",
    type: "Buy",
    entry: "4,032.50",
    exit: "4,047.50",
    result: 15,
    date: "29 Oct, 10:15",
  },
  {
    id: "#TF-023",
    symbol: "XAUUSD",
    type: "Sell",
    entry: "4,061.20",
    exit: "4,066.20",
    result: -5,
    date: "28 Oct, 14:30",
  },
  {
    id: "#TF-022",
    symbol: "XAUUSD",
    type: "Buy",
    entry: "4,018.00",
    exit: "4,038.00",
    result: 10,
    date: "27 Oct, 09:45",
  },
  {
    id: "#TF-021",
    symbol: "XAUUSD",
    type: "Sell",
    entry: "4,075.00",
    exit: "4,065.00",
    result: 8,
    date: "24 Oct, 15:20",
  },
];

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

type RecentTradesProps = {
  onOpenJournal: () => void;
};

export default function RecentTrades({ onOpenJournal }: RecentTradesProps) {
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
              <th className="pb-4 px-4 font-medium">نماد</th>
              <th className="pb-4 px-4 font-medium">نوع</th>
              <th className="pb-4 px-4 font-medium">قیمت ورود</th>
              <th className="pb-4 px-4 font-medium">قیمت خروج</th>
              <th className="pb-4 px-4 font-medium">زمان</th>
              <th className="pb-4 pr-4 text-left font-medium">نتیجه</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
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
                      trade.type === "Buy"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-rose-400/10 text-rose-400"
                    }`}
                  >
                    {trade.type === "Buy" ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}

                    {trade.type === "Buy" ? "خرید" : "فروش"}
                  </span>
                </td>

                <td
                  className="px-4 py-4 font-mono text-xs text-slate-300"
                  dir="ltr"
                >
                  {trade.entry}
                </td>

                <td
                  className="px-4 py-4 font-mono text-xs text-slate-300"
                  dir="ltr"
                >
                  {trade.exit}
                </td>

                <td className="px-4 py-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {trade.date}
                  </span>
                </td>

                <td className="py-4 pr-4 text-left font-semibold" dir="ltr">
                  <span
                    className={
                      trade.result > 0 ? "text-emerald-400" : "text-rose-400"
                    }
                  >
                    {trade.result > 0 ? "+" : ""}
                    {formatUsd(trade.result)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-4">
        <p className="text-xs text-slate-500">نمایش ۴ معامله از ۲۴ معامله</p>

        <div className="flex items-center gap-2">
          <button
            aria-label="صفحه قبل"
            className="rounded-lg border border-white/8 p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>

          <button
            aria-label="صفحه بعد"
            className="rounded-lg border border-white/8 p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
