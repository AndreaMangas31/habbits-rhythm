"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/types/dashboard";
import { cn } from "@/lib/utils/cn";

type TrendChartProps = {
  data: TrendPoint[];
  className?: string;
  stroke?: string;
};

export function TrendChart({
  data,
  className,
  stroke = "#6d5ff3",
}: TrendChartProps) {
  return (
    <div className={cn("h-48 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,0.08)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6f7285", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#6f7285", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Completado"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(26,26,46,0.08)",
              boxShadow: "0 8px 24px rgba(26,26,46,0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="completionRate"
            stroke={stroke}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
