import { Wallet, TrendingUp, Target, BarChart3 } from "lucide-react";

import StatCard from "../ui/stat-card";

const stats = [
  {
    title: "موجودی حساب",
    value: "$2,116.00",
    change: "+5.8%",
    positive: true,
    icon: Wallet,
    iconClass: "bg-cyan-400/10 text-cyan-300",
  },
  {
    title: "سود خالص",
    value: "+$116.00",
    change: "+8.2%",
    positive: true,
    icon: TrendingUp,
    iconClass: "bg-emerald-400/10 text-emerald-400",
  },
  {
    title: "نرخ برد",
    value: "68.4%",
    change: "+4.6%",
    positive: true,
    icon: Target,
    iconClass: "bg-violet-400/10 text-violet-300",
  },
  {
    title: "کل معاملات",
    value: "24",
    change: "-2.1%",
    positive: false,
    icon: BarChart3,
    iconClass: "bg-amber-400/10 text-amber-300",
  },
];

export default function DashboardStats() {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
}
