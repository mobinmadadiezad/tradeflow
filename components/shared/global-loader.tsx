"use client";

import { Activity } from "lucide-react";

type GlobalLoaderProps = {
  isLoading: boolean;
  message?: string;
};

export default function GlobalLoader({
  isLoading,
  message = "ANALYZING MARKET",
}: GlobalLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-[#070d18]/95 backdrop-blur-sm">
      <div className="relative flex w-full max-w-sm flex-col items-center px-8">
        <div className="absolute top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[80px]" />

        <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
          <Activity size={38} className="animate-pulse text-cyan-400" />
        </div>

        <h1 className="text-2xl font-bold tracking-[0.2em] text-white">
          TRADE<span className="text-cyan-400">FLOW</span>
        </h1>

        <p className="mt-2 text-xs tracking-[0.3em] text-slate-500">
          TRADING JOURNAL
        </p>

        <div className="mt-10 flex h-20 items-end gap-2">
          {[25, 42, 32, 58, 45, 70, 52, 80, 62].map((height, index) => (
            <div key={index} className="flex w-2 items-end">
              <div
                className="w-full rounded-sm bg-cyan-400 animate-pulse"
                style={{
                  height: `${height}px`,
                  animationDelay: `${index * 120}ms`,
                }}
              />
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs font-medium tracking-widest text-cyan-400">
          {message}
        </p>

        <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-linear-to-r from-cyan-600 to-cyan-300" />
        </div>

        <p className="mt-5 text-[10px] tracking-widest text-slate-600">
          PLEASE WAIT · TRADEFLOW
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
