import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Dumbbell, Flame, Footprints, Heart } from "lucide-react";
import { api } from "@/lib/api";

const COLORS = [
  "hsl(168,100%,37%)",
  "hsl(18,100%,60%)",
  "hsl(253,100%,69%)",
  "hsl(344,100%,65%)",
  "hsl(200,100%,50%)",
];

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

function shortDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-AU", { weekday: "short" });
}

function monthStart(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1)
    .toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

const chartConfig = {
  calories: { label: "Calories", color: "hsl(168,100%,37%)" },
  mins:     { label: "Minutes",  color: "hsl(18,100%,60%)" },
};

const Analytics = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.getWorkouts()
      .then(setWorkouts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const mStart = monthStart();
  const thisMonth = workouts.filter((w) => w.date && w.date >= mStart);

  // Stat cards
  const totalWorkouts = thisMonth.length;
  const totalCalBurned = thisMonth.reduce((s, w) => s + (w.calories_burned || 0), 0);
  const daysWithWorkouts = new Set(thisMonth.map((w) => w.date)).size;
  const avgDailyCalories = daysWithWorkouts ? Math.round(totalCalBurned / daysWithWorkouts) : 0;

  // Calories burned — last 30 days line chart
  const last30 = lastNDays(30);
  const calByDate: Record<string, number> = {};
  workouts.forEach((w) => { if (w.date) calByDate[w.date] = (calByDate[w.date] || 0) + (w.calories_burned || 0); });
  const caloriesData = last30.map((date, i) => ({
    day:      i + 1,
    calories: Math.round(calByDate[date] || 0),
  }));

  // Weekly workout duration — last 7 days bar chart
  const last7 = lastNDays(7);
  const durByDate: Record<string, number> = {};
  workouts.forEach((w) => { if (w.date) durByDate[w.date] = (durByDate[w.date] || 0) + (w.duration_minutes || 0); });
  const weeklyDuration = last7.map((date) => ({
    day:  shortDay(date),
    mins: durByDate[date] || 0,
  }));

  // Workout type breakdown pie
  const byType: Record<string, number> = {};
  thisMonth.forEach((w) => {
    const type = w.workout_type
      ? w.workout_type.charAt(0).toUpperCase() + w.workout_type.slice(1)
      : "Other";
    byType[type] = (byType[type] || 0) + 1;
  });
  const workoutBreakdown = Object.entries(byType).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length],
  }));

  const metricCards = [
    { label: "Total Workouts",    value: totalWorkouts.toString(),    sub: "This Month",  icon: Dumbbell,  color: "stat-card-teal" },
    { label: "Avg Daily Calories", value: avgDailyCalories.toString(), sub: "Burned",      icon: Flame,     color: "stat-card-orange" },
    { label: "Avg Daily Steps",   value: "—",                         sub: "Watch needed", icon: Footprints, color: "stat-card-pink" },
    { label: "Avg Heart Rate",    value: "—",                         sub: "Watch needed", icon: Heart,     color: "stat-card-purple" },
  ];

  const hasData = workouts.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((c) => (
          <div key={c.label} className={`${c.color} rounded-2xl p-5 text-white`}>
            <c.icon className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm opacity-80">{c.label}</p>
            <p className="text-xs opacity-60">{c.sub}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Calories Burned — Last 30 Days</CardTitle></CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
              No workout data yet — log workouts to see your trend
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="calories" stroke="hsl(168,100%,37%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Weekly Workout Duration</CardTitle></CardHeader>
          <CardContent>
            {!hasData ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No workouts this week
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <BarChart data={weeklyDuration}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="mins" fill="hsl(18,100%,60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Workout Type Breakdown</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            {workoutBreakdown.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No workouts this month
              </div>
            ) : (
              <div className="flex items-center w-full h-[220px]">
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie data={workoutBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                      {workoutBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 flex-1">
                  {workoutBreakdown.map((w) => (
                    <div key={w.name} className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: w.color }} />
                      <span className="text-muted-foreground truncate">{w.name}</span>
                      <span className="ml-auto font-semibold text-foreground">{w.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
