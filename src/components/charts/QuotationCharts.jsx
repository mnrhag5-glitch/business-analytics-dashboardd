
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactCurrency } from "../../utils/formatters";

const STATUS_COLORS = {
  Accepted: "#16a34a",
  Sent: "#6366f1",
  Draft: "#94a3b8",
  Revised: "#f59e0b",
  Rejected: "#ef4444",
  Expired: "#64748b",
};

function EmptyChart({ children }) {
  return (
    <div className="flex h-full min-h-64 items-center justify-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function QuotationStatusChart({ data = [] }) {
  const chartData = data.map((item) => ({
    ...item,
    name: item.name ?? item.status ?? "Other",
    value: Number(item.value ?? item.count ?? 0),
  }));

  if (!chartData.length) {
    return <EmptyChart>No quotation data for this period.</EmptyChart>;
  }

  return (
    <div className="h-full min-h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="78%"
            paddingAngle={3}
            stroke="none"
          >
            {chartData.map((item, index) => (
              <Cell
                key={`${item.name}-${index}`}
                fill={STATUS_COLORS[item.name] ?? "#64748b"}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{
              border: "1px solid #e9edf5",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function QuotationServiceChart({ data = [] }) {
  const chartData = data.map((item) => ({
    ...item,
    name: item.name ?? item.service ?? "Other",
    value: Number(item.value ?? item.amount ?? 0),
  }));

  if (!chartData.length) {
    return <EmptyChart>No service quotation data.</EmptyChart>;
  }

  return (
    <div className="h-full min-h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 18, left: 12, bottom: 4 }}
        >
          <CartesianGrid
            stroke="#e9edf5"
            strokeDasharray="4 4"
            horizontal={false}
          />

          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8993a7", fontSize: 10 }}
            tickFormatter={formatCompactCurrency}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={118}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />

          <Tooltip
            formatter={(value) => [
              formatCompactCurrency(value),
              "Quotation value",
            ]}
            contentStyle={{
              border: "1px solid #e9edf5",
              borderRadius: 12,
              fontSize: 12,
            }}
          />

          <Bar
            dataKey="value"
            fill="#818cf8"
            radius={[0, 5, 5, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
