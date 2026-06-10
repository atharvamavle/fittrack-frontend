import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function melbourneToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
  });
}

function shortDay(isoDate: string): string {
  // isoDate = "2026-06-10" — parse as local date to avoid UTC shift
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-AU", { weekday: "short" });
}

const ActivityChart = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    api.getWorkouts().then(setWorkouts).catch(console.error);
  }, []);

  const today = melbourneToday();
  const days  = lastNDays(7);

  // Sum calories burned per day
  const byDate: Record<string, number> = {};
  workouts.forEach((w) => {
    if (w.date) byDate[w.date] = (byDate[w.date] || 0) + (w.calories_burned || 0);
  });

  const data = days.map((date) => ({
    day:     shortDay(date),
    value:   Math.round(byDate[date] || 0),
    isToday: date === today,
  }));

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Activity</h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5">Weekly</span>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
          <p className="text-sm">No workouts logged yet</p>
          <p className="text-xs mt-1">Log a workout to see your activity</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(220 10% 46%)" }}
            />
            <YAxis hide />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isToday ? "hsl(18 100% 60%)" : "hsl(210 40% 90%)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ActivityChart;
