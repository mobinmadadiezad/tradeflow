import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  iconClass: string;
};
export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  iconClass,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium ${positive ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-red-400"}`}
        >
            {positive ? (
                <ArrowUpRight />
            ) : (
                <ArrowDownRight />
            )}

            {change}
        </span>
        <span className="text-slate-500">نسبت به ماه قبل</span>
      </div>
    </article>
  );
}
