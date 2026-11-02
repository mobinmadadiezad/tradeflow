"use client";

import { ShieldCheck, ClipboardCheck, ChevronLeft } from "lucide-react";

type RiskOverviewProps = {
  onOpenChecklist: () => void;
};

export default function RiskOverview({ onOpenChecklist }: RiskOverviewProps) {
  return (
    <div className="panel">
      {/* عنوان پنل */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">مدیریت ریسک</h3>

          <p className="mt-1 text-xs text-slate-500">وضعیت محدودیت‌های امروز</p>
        </div>

        <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-400">
          <ShieldCheck size={19} />
        </div>
      </div>

      {/* وضعیت کلی ریسک */}
      <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          وضعیت ریسک مطلوب
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          هنوز معامله‌ای برای امروز ثبت نشده است. قبل از ورود، چک‌لیستت را بررسی
          کن.
        </p>
      </div>

      {/* محدودیت‌های معاملاتی */}
      <div className="mt-5 space-y-5">
        {/* ریسک هر معامله */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">ریسک هر معامله</span>

            <span className="font-medium text-white" dir="ltr">
              0.25% / 0.25%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/6">
            <div className="h-full w-full rounded-full bg-cyan-400" />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            حداکثر ریسک برنامه‌ریزی‌شده: $5
          </p>
        </div>

        {/* تعداد معاملات امروز */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">معاملات امروز</span>

            <span className="font-medium text-white">۰ از ۲</span>
          </div>

          <div className="flex gap-2">
            <div className="h-2 flex-1 rounded-full bg-white/8" />
            <div className="h-2 flex-1 rounded-full bg-white/8" />
          </div>
        </div>

        {/* حد ضرر روزانه */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">حد ضرر روزانه</span>

            <span className="font-medium text-white" dir="ltr">
              $0 / $10
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/6">
            <div className="h-full w-0 rounded-full bg-rose-400" />
          </div>
        </div>
      </div>

      {/* رفتن به چک‌لیست */}
      <button
        onClick={onOpenChecklist}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
      >
        <ClipboardCheck size={17} />
        بررسی چک‌لیست ورود
        <ChevronLeft size={16} className="mr-auto" />
      </button>
    </div>
  );
}
