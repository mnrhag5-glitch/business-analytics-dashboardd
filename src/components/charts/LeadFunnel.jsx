
import {
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#6366f1", "#0ea5e9", "#16a34a"];

export default function LeadFunnel({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center text-sm text-slate-500">
        No funnel data available for this period.
      </div>
    );
  }

  const funnelData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-full min-h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip
            formatter={(value) => [value, "Leads"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e8ebf0",
              boxShadow: "0 8px 24px rgba(20, 30, 60, 0.08)",
            }}
          />

          <Funnel
            dataKey="value"
            data={funnelData}
            isAnimationActive
          >
            <LabelList
              dataKey="name"
              position="right"
              fill="#526078"
              stroke="none"
              fontSize={12}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
