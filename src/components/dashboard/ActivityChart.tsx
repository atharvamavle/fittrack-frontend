import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const data = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 50 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 45 },
  { day: "Sat", value: 70 },
  { day: "Sun", value: 55 },
];

const ActivityChart = () => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Activity</h3>
        <select className="text-xs bg-muted rounded-lg px-3 py-1.5 text-muted-foreground border-none outline-none">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="20%">
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(220 10% 46%)" }} />
          <YAxis hide />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 3 ? "hsl(18 100% 60%)" : "hsl(210 40% 90%)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
