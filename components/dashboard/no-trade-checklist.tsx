"use client";

import type { TradingRule } from "@/types/trading-plan";
import { AlertTriangle } from "lucide-react";

type NoTradeChecklistProps = {
  rules: TradingRule[];
  activeBlocks: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export default function NoTradeChecklist({
  rules,
  activeBlocks,
  onToggle,
}: NoTradeChecklistProps) {
  if (rules.length === 0) return null;

  const activeCount = rules.filter((rule) => activeBlocks[rule.id]).length;

  return (
    <div className="rounded-2xl border border-red-400/20 bg-[#111827] p-5">
      <div className="mb-4 flex items-center gap-3">
        <AlertTriangle className="text-red-400" size={22} />

        <div>
          <h2 className="font-bold text-white">بررسی موانع معامله</h2>

          <p className="mt-1 text-sm text-slate-400">
            اگر هرکدام از این شرایط برقرار است، آن را فعال کن.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule, index) => {
          const isActive = Boolean(activeBlocks[rule.id]);

          return (
            <label
              key={rule.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                isActive
                  ? "border-red-400/30 bg-red-400/10"
                  : "border-white/6 bg-[#0B1220]"
              }`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggle(rule.id)}
                className="mt-1 h-4 w-4 accent-red-400"
              />

              <div className="flex-1">
                <p
                  className={`text-sm leading-6 ${
                    isActive ? "text-red-300" : "text-slate-300"
                  }`}
                >
                  {index + 1}. {rule.text}
                </p>

                {isActive && (
                  <p className="mt-2 text-xs font-semibold text-red-400">
                    مانع فعال معامله
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl bg-red-400/5 p-3">
        <p className="text-sm text-red-300">
          {activeCount > 0
            ? `${activeCount} مانع فعال وجود دارد؛ فعلاً معامله نکن.`
            : "هیچ مانع فعالی ثبت نشده است."}
        </p>
      </div>
    </div>
  );
}
