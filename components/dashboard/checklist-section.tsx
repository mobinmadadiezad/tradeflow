"use client";

import type { TradingRule } from "@/types/trading-plan";
import type { ChecklistState } from "@/lib/checklist-storage";

type ChecklistSectionProps = {
  title: string;
  description: string;
  rules: TradingRule[];
  checkedRules: ChecklistState;
  onToggle: (id: string) => void;
};

export default function ChecklistSection({
  title,
  description,
  rules,
  checkedRules,
  onToggle,
}: ChecklistSectionProps) {
  if (rules.length === 0) return null;

  const completedCount = rules.filter((rule) => checkedRules[rule.id]).length;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111827]">
      <div className="flex items-center justify-between p-5">
        <div>
          <h2 className="font-bold text-white">{title}</h2>

          <p className="mt-1 text-sm text-slate-400">{description}</p>

          <span className="mt-2 inline-block text-xs text-cyan-400">
            {completedCount} از {rules.length} شرط تأیید شده
          </span>
        </div>
      </div>

      <div className="space-y-2 border-t border-white/6 p-5">
        {rules.map((rule, index) => {
          const isChecked = Boolean(checkedRules[rule.id]);

          return (
            <label
              key={rule.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                isChecked
                  ? "border-green-400/20 bg-green-400/5"
                  : "border-white/4 bg-[#0B1220]"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(rule.id)}
                className="mt-1 h-4 w-4 accent-cyan-400"
              />

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-xs text-cyan-300">
                {index + 1}
              </span>

              <span
                className={`text-sm leading-6 ${
                  isChecked ? "text-green-300" : "text-slate-300"
                }`}
              >
                {rule.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
