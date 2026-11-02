"use client";

import { useState, type ReactNode } from "react";
import { Bell, ChevronLeft, Menu, Search } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { usePathname } from "next/navigation";

type DashboardLayoutProps = {
  children: ReactNode;
};

const navigationLabels: Record<string, string> = {
  "/": "داشبورد",
  "/trading-plan": "پلن معاملاتی",
  "/checklist": "چک‌لیست ورود",
  "/journal": "ژورنال معاملات",
  "/analytics": "تحلیل عملکرد",
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const activeNav = navigationLabels[pathname] ?? "فضای معاملاتی";

  return (
    <main dir="rtl" className="min-h-screen bg-[#080d17] text-slate-100">
      {mobileMenuOpen && (
        <button
          aria-label="بستن منو"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeNav={activeNav}
        mobileMenuOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="min-h-screen lg:mr-64">
        <header className="sticky top-0 z-30 flex h-20.5 items-center justify-between border-b border-white/[0.07] bg-[#080d17]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="باز کردن منو"
              className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">فضای معاملاتی</span>
                <ChevronLeft size={14} className="text-slate-600" />
                <span className="text-sm font-medium text-white">
                  {activeNav}
                </span>
              </div>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                عملکردت را بررسی کن و با برنامه جلو برو.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-white/8 bg-white/2 px-3 py-2 text-xs text-slate-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              حساب دمو فعال
            </div>

            <button
              aria-label="جست‌وجو"
              className="rounded-xl border border-white/8 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Search size={18} />
            </button>

            <button
              aria-label="اعلان‌ها"
              className="relative rounded-xl border border-white/8 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 ring-2 ring-[#080d17]" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
          {children}
        </div>
      </div>
    </main>
  );
}
