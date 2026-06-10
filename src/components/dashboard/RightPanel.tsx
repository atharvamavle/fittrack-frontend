import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { melbourneToday, monthStart, cmToFeetInches, goalLabels, workoutTargets } from "@/lib/fitness";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const RightPanel = () => {
  const [profile,  setProfile]  = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [summary,  setSummary]  = useState<any>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
    api.getWorkouts().then(setWorkouts).catch(() => {});
    api.getSummary().then(setSummary).catch(() => {});
  }, []);

  const name     = profile?.name      || "—";
  const weightKg = profile?.weight_kg ?? "—";
  const heightCm = profile?.height_cm;
  const age      = profile?.age       ?? "—";
  const goalKey  = profile?.goal      || "stay_fit";
  const actLevel = profile?.activity_level || "moderate";

  const stats = [
    { label: "Weight", value: weightKg !== "—" ? String(weightKg) : "—", unit: "kg" },
    { label: "Height", value: heightCm ? cmToFeetInches(heightCm) : "—", unit: "ft" },
    { label: "Age",    value: String(age), unit: "yrs" },
  ];

  // Monthly workouts progress
  const start = monthStart();
  const thisMonthWorkouts = workouts.filter((w) => w.date && w.date >= start);
  const workoutTarget = workoutTargets[actLevel] || 16;
  const workoutPct = Math.min(Math.round((thisMonthWorkouts.length / workoutTarget) * 100), 100);

  // Today's calorie deficit/surplus
  const today = melbourneToday();
  const burned = summary?.total_calories_burned ?? 0;
  const eaten  = summary?.total_calories_eaten  ?? 0;
  const calorieGoal = 2000; // kcal target (will be personalised later)
  const caloriePct  = Math.min(Math.round((burned / calorieGoal) * 100), 100);
  const mealPct     = Math.min(Math.round((eaten  / calorieGoal) * 100), 100);

  const realGoals = [
    {
      label: "Workouts this month",
      current: thisMonthWorkouts.length,
      target:  workoutTarget,
      unit: "",
      pct: workoutPct,
      color: "hsl(168 100% 37%)",
    },
    {
      label: "Calories burned today",
      current: burned,
      target: calorieGoal,
      unit: " kcal",
      pct: caloriePct,
      color: "hsl(18 100% 60%)",
    },
    {
      label: "Calories eaten today",
      current: eaten,
      target: calorieGoal,
      unit: " kcal",
      pct: mealPct,
      color: "hsl(253 100% 69%)",
    },
  ];

  return (
    <div className="space-y-5">
      {/* User Stats */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple flex items-center justify-center text-primary-foreground font-bold text-lg">
            {profile ? getInitials(name) : "…"}
          </div>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{goalLabels[goalKey] ?? goalKey}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals — real data */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Your Goals</h3>
        <div className="space-y-4">
          {realGoals.map((goal) => (
            <div key={goal.label} className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(220 13% 91%)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="14" fill="none"
                    stroke={goal.color} strokeWidth="3"
                    strokeDasharray={`${goal.pct * 0.88} 88`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{goal.label}</p>
                <p className="text-xs text-muted-foreground">
                  {goal.current}{goal.unit} / {goal.target}{goal.unit}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground">{goal.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Progress */}
      <div className="bg-card rounded-2xl p-5 border border-border text-center">
        <h3 className="font-semibold text-foreground mb-4">Monthly Progress</h3>
        <div className="relative w-32 h-16 mx-auto overflow-hidden">
          <svg className="w-32 h-32" viewBox="0 0 100 50">
            <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="hsl(220 13% 91%)" strokeWidth="8" strokeLinecap="round" />
            <path
              d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="hsl(168 100% 37%)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${workoutPct * 1.26} 126`}
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-foreground mt-1">{workoutPct}%</p>
        <p className="text-xs text-muted-foreground">
          {thisMonthWorkouts.length} / {workoutTarget} workouts this month
        </p>
      </div>
    </div>
  );
};

export default RightPanel;
