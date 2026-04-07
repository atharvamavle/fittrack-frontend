import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Dumbbell, Flame, Footprints, Heart } from "lucide-react";

const metricCards = [
  { label: "Total Workouts", value: "24", sub: "This Month", icon: Dumbbell, color: "stat-card-teal" },
  { label: "Avg Daily Calories", value: "487", sub: "Burned", icon: Flame, color: "stat-card-orange" },
  { label: "Avg Daily Steps", value: "8,241", sub: "Per Day", icon: Footprints, color: "stat-card-pink" },
  { label: "Avg Heart Rate", value: "72", sub: "BPM", icon: Heart, color: "stat-card-purple" },
];

const caloriesData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  calories: Math.floor(300 + Math.random() * 400),
}));

const weeklyDuration = [
  { day: "Mon", mins: 45 },
  { day: "Tue", mins: 30 },
  { day: "Wed", mins: 60 },
  { day: "Thu", mins: 0 },
  { day: "Fri", mins: 50 },
  { day: "Sat", mins: 75 },
  { day: "Sun", mins: 40 },
];

const workoutBreakdown = [
  { name: "Cardio", value: 8, color: "hsl(168, 100%, 37%)" },
  { name: "Strength", value: 6, color: "hsl(18, 100%, 60%)" },
  { name: "Stretching", value: 5, color: "hsl(253, 100%, 69%)" },
  { name: "Treadmill", value: 5, color: "hsl(344, 100%, 65%)" },
];

const chartConfig = {
  calories: { label: "Calories", color: "hsl(168, 100%, 37%)" },
  mins: { label: "Minutes", color: "hsl(18, 100%, 60%)" },
};

const Analytics = () => (
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
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={caloriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="calories" stroke="hsl(168, 100%, 37%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>

    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Weekly Workout Duration</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={weeklyDuration}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="mins" fill="hsl(18, 100%, 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Workout Type Breakdown</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={workoutBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {workoutBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 ml-4 min-w-[100px]">
            {workoutBreakdown.map((w) => (
              <div key={w.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ background: w.color }} />
                <span className="text-muted-foreground">{w.name}</span>
                <span className="ml-auto font-semibold text-foreground">{w.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Analytics;
