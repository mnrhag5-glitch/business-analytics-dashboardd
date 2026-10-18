
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactNumber } from "../../utils/formatters";

export default function LeadTrendChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center text-sm text-slate-500">
        No lead data available for this period.
      </div>
    );
  }

  return (
    <div className="h-full min-h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 12, right: 12, left: -14, bottom: 0 }}
        >
          <defs>
            <linearGradient id="leadTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#e9edf5"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8993a7", fontSize: 11 }}
            tickMargin={10}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8993a7", fontSize: 10 }}
            tickFormatter={formatCompactNumber}
            allowDecimals={false}
          />

          <Tooltip
            formatter={(value) => [value, "Leads"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e8ebf0",
              boxShadow: "0 8px 24px rgba(20, 30, 60, 0.08)",
            }}
          />

          <Area
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#leadTrendFill)"
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
