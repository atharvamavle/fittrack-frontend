import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const COLORS = [
  "hsl(168 100% 37%)",
  "hsl(18 100% 60%)",
  "hsl(344 100% 65%)",
  "hsl(253 100% 69%)",
  "hsl(200 100% 50%)",
  "hsl(45 100% 55%)",
];

function melbourneToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

function weekStart(): string {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day);
  return d.toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

const ProgressChart = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    api.getWorkouts().then(setWorkouts).catch(console.error);
  }, []);

  const start = weekStart();

  // Group this week's workouts by type, sum duration hours
  const byType: Record<string, number> = {};
  workouts.forEach((w) => {
    if (w.date && w.date >= start) {
      const type = w.workout_type
        ? w.workout_type.charAt(0).toUpperCase() + w.workout_type.slice(1)
        : "Other";
      byType[type] = (byType[type] || 0) + (w.duration_minutes || 0) / 60;
    }
  });

  const data = Object.entries(byType).map(([name, hours], i) => ({
    name,
    value: Math.round(hours * 10) / 10,
    color: COLORS[i % COLORS.length],
  }));

  const hasData = data.length > 0;

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Progress</h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5">This week</span>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[140px] text-muted-foreground">
          <p className="text-sm">No workouts this week</p>
          <p className="text-xs mt-1">Log workouts to see your breakdown</p>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={40} outerRadius={60}
                paddingAngle={4}
                dataKey="value"
              >
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
      )}
    </div>
  );
};

export default ProgressChart;
