"use client";

import { Wallet, TrendingUp, Target, BarChart3 } from "lucide-react";

import StatCard from "../ui/stat-card";
import { useTrades } from "@/hooks/use-trades";
import { useAccount } from "@/hooks/use-account";
import { calculateTradeStats } from "@/lib/trade-analytics";
import {
  calculateCurrentBalance,
  calculateNetProfitLoss,
} from "@/lib/account-analytics";

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function DashboardStats() {
  const { trades } = useTrades();
  const { account } = useAccount();

  const stats = calculateTradeStats(trades);

  const currentBalance = calculateCurrentBalance(
    account.initialBalance,
    trades,
  );

  const netProfitLoss = trades.reduce(
    (total, trade) => total + calculateNetProfitLoss(trade),
    0,
  );

  const cards = [
    {
      title: "موجودی حساب",
      value: formatUsd(currentBalance),
      change: "موجودی محاسبه‌شده",
      positive: true,
      icon: Wallet,
      iconClass: "bg-cyan-400/10 text-cyan-300",
    },
    {
      title: "سود / زیان خالص",
      value: `${netProfitLoss > 0 ? "+" : ""}${formatUsd(netProfitLoss)}`,
      change: "پس از هزینه‌ها",
      positive: netProfitLoss >= 0,
      icon: TrendingUp,
      iconClass: "bg-emerald-400/10 text-emerald-400",
    },
    {
      title: "نرخ برد",
      value: `${stats.winRate.toFixed(1)}%`,
      change: `${stats.winningTrades} برد از ${stats.totalTrades} معامله`,
      positive: stats.winRate >= 50,
      icon: Target,
      iconClass: "bg-violet-400/10 text-violet-300",
    },
    {
      title: "کل معاملات",
      value: stats.totalTrades.toString(),
      change: `${stats.losingTrades} باخت · ${stats.breakevenTrades} سربه‌سر`,
      positive: true,
      icon: BarChart3,
      iconClass: "bg-amber-400/10 text-amber-300",
    },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </section>
  );
}
