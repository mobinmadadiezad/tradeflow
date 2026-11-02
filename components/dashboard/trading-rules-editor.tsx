"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

import type { TradingRule } from "@/types/trading-plan";

type TradingRulesEditorProps = {
  title: string;
  description?: string;
  rules: TradingRule[];
  onChange: (rules: TradingRule[]) => void;
};

export default function TradingRulesEditor({
  title,
  description,
  rules,
  onChange,
}: TradingRulesEditorProps) {
  const [newRule, setNewRule] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // افزودن شرط جدید
  const handleAddRule = () => {
    const text = newRule.trim();

    if (!text) return;

    const rule: TradingRule = {
      id: crypto.randomUUID(),
      text,
    };

    onChange([...rules, rule]);
    setNewRule("");
  };

  // شروع ویرایش شرط
  const handleStartEdit = (rule: TradingRule) => {
    setEditingId(rule.id);
    setEditingText(rule.text);
  };

  // ذخیره ویرایش شرط
  const handleSaveEdit = (id: string) => {
    const text = editingText.trim();

    if (!text) return;

    const updatedRules = rules.map((rule) =>
      rule.id === id ? { ...rule, text } : rule,
    );

    onChange(updatedRules);
    setEditingId(null);
    setEditingText("");
  };

  // حذف شرط
  const handleDeleteRule = (id: string) => {
    onChange(rules.filter((rule) => rule.id !== id));
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">{title}</h2>

        {description && (
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        )}
      </div>

      {/* لیست شرط‌ها */}
      <div className="mb-5 space-y-3">
        {rules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-slate-500">
            هنوز شرطی اضافه نشده است.
          </div>
        ) : (
          rules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex items-start gap-3 rounded-xl border border-white/6 bg-[#0B1220] p-3"
            >
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-semibold text-cyan-300">
                {index + 1}
              </span>

              {editingId === rule.id ? (
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#111827] p-2 text-sm text-white outline-none focus:border-cyan-400"
                    autoFocus
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(rule.id)}
                      className="rounded-lg p-2 text-green-400 transition hover:bg-green-400/10"
                      aria-label="ذخیره ویرایش"
                    >
                      <Check size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5"
                      aria-label="لغو ویرایش"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="flex-1 wrap-break-word text-sm leading-6 text-slate-300">
                    {rule.text}
                  </p>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(rule)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                      aria-label="ویرایش شرط"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-400/10 hover:text-red-400"
                      aria-label="حذف شرط"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* افزودن شرط */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddRule();
            }
          }}
          placeholder="شرط جدید را بنویس..."
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0B1220] p-3 text-sm text-white outline-none focus:border-cyan-400"
        />

        <button
          type="button"
          onClick={handleAddRule}
          disabled={!newRule.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={18} />
          افزودن شرط
        </button>
      </div>
    </div>
  );
}
