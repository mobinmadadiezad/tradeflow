"use client";

import { Newspaper } from "lucide-react";
import type { TradingRule } from "@/types/trading-plan";

type NewsChecklistProps = {
  rules: TradingRule[];
  activeNews: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export default function NewsChecklist({
  rules,
  activeNews,
  onToggle,
}: NewsChecklistProps) {
  if (rules.length === 0) return null;

  const activeCount = rules.filter((rule) => activeNews[rule.id]).length;

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-[#111827] p-5">
      <div className="mb-4 flex items-center gap-3">
        <Newspaper className="text-amber-400" size={22} />

        <div>
          <h2 className="font-bold text-white">فیلتر اخبار اقتصادی</h2>

          <p className="mt-1 text-sm text-slate-400">
            اگر شرایط خبری مانع معامله است، آن را فعال کن.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule, index) => {
          const isActive = Boolean(activeNews[rule.id]);

          return (
            <label
              key={rule.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                isActive
                  ? "border-amber-400/30 bg-amber-400/10"
                  : "border-white/6 bg-[#0B1220]"
              }`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggle(rule.id)}
                className="mt-1 h-4 w-4 accent-amber-400"
              />

              <span className="text-sm leading-6 text-slate-300">
                {index + 1}. {rule.text}
              </span>
            </label>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-amber-300">
        {activeCount > 0
          ? `${activeCount} مانع خبری فعال است.`
          : "هیچ مانع خبری ثبت نشده است."}
      </p>
    </div>
  );
}
