"use client";

import {
  Activity,
  BarChart3,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useTrades } from "@/hooks/use-trades";
import {
  subscribeTradingPlan,
  getTradingPlanSnapshot,
  getTradingPlanServerSnapshot,
  parseTradingPlanSnapshot,
} from "@/lib/trading-plan-storage";

type SidebarProps = {
  activeNav: string;
  mobileMenuOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({
  activeNav,
  mobileMenuOpen,
  onClose,
}: SidebarProps) {
  const navigation = [
    { label: "داشبورد", icon: LayoutDashboard, href: "/" },
    { label: "پلن معاملاتی", icon: ClipboardCheck, href: "/trading-plan" },
    { label: "چک‌لیست ورود", icon: ShieldCheck, href: "/checklist" },
    { label: "ژورنال معاملات", icon: Activity, href: "/journal" },
    { label: "تحلیل عملکرد", icon: BarChart3, href: "/analytics" },
  ];

  const pathname = usePathname();

  const { trades } = useTrades();

  const planSnapshot = useSyncExternalStore(
    subscribeTradingPlan,
    getTradingPlanSnapshot,
    getTradingPlanServerSnapshot,
  );

  const plan = parseTradingPlanSnapshot(planSnapshot);

  const todayTradeCount = trades.filter((trade) => {
    const tradeDate = new Date(trade.openDate);
    const today = new Date();

    return (
      tradeDate.getFullYear() === today.getFullYear() &&
      tradeDate.getMonth() === today.getMonth() &&
      tradeDate.getDate() === today.getDate()
    );
  }).length;

  const maxDailyTrades = plan?.maxDailyTrades ?? 0;

  const progress =
    maxDailyTrades > 0
      ? Math.min((todayTradeCount / maxDailyTrades) * 100, 100)
      : 0;

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l border-white/[0.07] bg-[#0b111e] transition-transform duration-300 lg:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* لوگو و عنوان برنامه */}
      <div className="flex h-20.5 items-center justify-between border-b border-white/[0.07] px-6">
        <div className="flex items-center gap-3" dir="ltr">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Activity size={23} strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">
              Trade<span className="text-cyan-400">Flow</span>
            </h1>
            <p className="text-[10px] tracking-[0.18em] text-slate-500">
              TRADING WORKSPACE
            </p>
          </div>
        </div>

        <button
          className="text-slate-400 lg:hidden"
          onClick={onClose}
          aria-label="بستن منو"
        >
          <X size={20} />
        </button>
      </div>

      {/* منوی اصلی */}
      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[11px] font-semibold tracking-widest text-slate-500">
          فضای معاملاتی
        </p>

        <nav className="space-y-1">
          {navigation.map(({ label, icon: Icon, href }) => {
            const active = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "border border-cyan-400/15 bg-cyan-400/9 text-cyan-300"
                    : "text-slate-400 hover:bg-white/4 hover:text-slate-100"
                }`}
              >
                <Icon size={19} />

                <span>{label}</span>

                {active && (
                  <span className="mr-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* تنظیمات و راهنما */}
      <div className="mt-8 px-4">
        <p className="mb-3 px-3 text-[11px] font-semibold tracking-widest text-slate-500">
          تنظیمات
        </p>

        <button
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
            activeNav === "تنظیمات"
              ? "bg-cyan-400/9 text-cyan-300"
              : "text-slate-400 hover:bg-white/4 hover:text-slate-100"
          }`}
        >
          <Settings size={19} />
          تنظیمات
        </button>

        <button
          className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
            activeNav === "راهنما"
              ? "bg-cyan-400/9 text-cyan-300"
              : "text-slate-400 hover:bg-white/4 hover:text-slate-100"
          }`}
        >
          <CircleHelp size={19} />
          راهنما
        </button>
      </div>

      {/* هدف روزانه و حساب کاربر */}
      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-cyan-400/15 bg-linear-to-br from-cyan-400/10 to-blue-500/4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Target className="text-cyan-300" size={19} />

            <span className="text-sm font-semibold text-white">هدف امروز</span>
          </div>

          <p className="text-xs leading-6 text-slate-400">
            با نظم معامله کن؛ نه با عجله. کیفیت مهم‌تر از تعداد معاملات است.
          </p>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">سقف معاملات روزانه</span>

            <span className="font-semibold text-cyan-300">
              {maxDailyTrades > 0
                ? `${todayTradeCount} از ${maxDailyTrades}`
                : `${todayTradeCount} معامله`}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {maxDailyTrades <= 0 && (
            <p className="mt-2 text-[10px] text-slate-500">
              سقف معاملات در پلن تعیین نشده است.
            </p>
          )}

          {maxDailyTrades > 0 && todayTradeCount >= maxDailyTrades && (
            <p className="mt-2 text-[10px] text-amber-300">
              به سقف معاملات امروز رسیده‌ای.
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-sm font-bold text-cyan-300">
            T
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-200">
              معامله‌گر
            </p>
            <p className="mt-1 text-xs text-slate-500">حساب دمو</p>
          </div>

          <ChevronDown size={16} className="text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
