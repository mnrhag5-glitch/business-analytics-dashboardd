
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

import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from "../../utils/formatters";

const STATUS_COLORS = {
  Won: "#16a34a",
  "In Progress": "#6366f1",
  Negotiation: "#f59e0b",
  Proposal: "#0ea5e9",
  Lost: "#ef4444",
};

function EmptyChart({ children }) {
  return (
    <div className="flex h-full min-h-64 items-center justify-center text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function RevenueTrendChart({ data = [] }) {
  const chartData = data
    .map((item) => {
      const rawRevenue = Number(item.revenue ?? item.amount ?? 0);

      return {
        ...item,
        label: item.label ?? item.date ?? "",
        revenue:
          Number.isFinite(rawRevenue) && rawRevenue >= 0
            ? rawRevenue
            : 0,
      };
    })
    .sort((a, b) =>
      String(a.date ?? "").localeCompare(String(b.date ?? "")),
    );

  if (!chartData.length) {
    return (
      <EmptyChart>
        No completed payments for this period.
      </EmptyChart>
    );
  }

  return (
    <div className="h-full min-h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
        >
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
            tickFormatter={formatCompactCurrency}
            width={72}
          />

          <Tooltip
            formatter={(value) => [
              formatCurrency(value),
              "Collected revenue",
            ]}
            contentStyle={{
              border: "1px solid #e9edf5",
              borderRadius: 12,
              fontSize: 12,
            }}
          />

          <Bar
            dataKey="revenue"
            name="Collected revenue"
            fill="#6366f1"
            radius={[5, 5, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DealStatusChart({ data = [] }) {
  const chartData = data.map((item) => {
    const rawValue = Number(item.value ?? item.count ?? 0);

    return {
      ...item,
      name: item.name ?? item.status ?? "Other",
      value:
        Number.isFinite(rawValue) && rawValue >= 0
          ? rawValue
          : 0,
    };
  });

  if (!chartData.length) {
    return (
      <EmptyChart>
        No deal data available for this period.
      </EmptyChart>
    );
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
                fill={STATUS_COLORS[item.name] ?? "#94a3b8"}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [
              formatNumber(value),
              name,
            ]}
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
