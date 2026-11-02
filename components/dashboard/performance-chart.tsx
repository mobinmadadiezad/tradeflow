"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type PerformanceData = {
  date: string;
  profitLoss: number;
};

type PerformanceChartProps = {
  data: PerformanceData[];
};

function formatDate(date: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
          />

          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelFormatter={(label) => formatDate(String(label))}
            formatter={(value) => [
              `$${Number(value).toFixed(2)}`,
              "سود / زیان",
            ]}
          />

          <Line
            type="monotone"
            dataKey="profitLoss"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
