import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Cardio", value: 4, color: "hsl(168 100% 37%)" },
  { name: "Stretching", value: 2.5, color: "hsl(18 100% 60%)" },
  { name: "Treadmill", value: 3, color: "hsl(344 100% 65%)" },
  { name: "Strength", value: 5, color: "hsl(253 100% 69%)" },
];

const ProgressChart = () => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Progress</h3>
        <select className="text-xs bg-muted rounded-lg px-3 py-1.5 text-muted-foreground border-none outline-none">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-3 flex-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{item.value}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
