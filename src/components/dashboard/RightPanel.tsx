import { MoreHorizontal } from "lucide-react";

const stats = [
  { label: "Weight", value: "72", unit: "kg" },
  { label: "Height", value: "5'9\"", unit: "ft" },
  { label: "Age", value: "28", unit: "yrs" },
];

const goals = [
  { label: "Running", current: 70, target: 90, unit: "km", color: "hsl(168 100% 37%)" },
  { label: "Sleeping", current: 6.5, target: 8, unit: "hrs", color: "hsl(253 100% 69%)" },
  { label: "Weight Loss", current: 3, target: 5, unit: "kg", color: "hsl(344 100% 65%)" },
];

const schedule = [
  { title: "Yoga Class", time: "Today, 4:00 PM", tag: "Training" },
  { title: "Swimming", time: "Tomorrow, 7:00 AM", tag: "Training" },
  { title: "Upper Body", time: "Wed, 5:30 PM", tag: "Training" },
];

const RightPanel = () => {
  const monthlyProgress = 74;

  return (
    <div className="space-y-5">
      {/* User Stats */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple flex items-center justify-center text-primary-foreground font-bold">
            AJ
          </div>
          <div>
            <p className="font-semibold text-foreground">Alex Johnson</p>
            <p className="text-xs text-muted-foreground">Pro Member</p>
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

      {/* Goals */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Your Goals</h3>
        <div className="space-y-4">
          {goals.map((goal) => {
            const pct = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.label} className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(220 13% 91%)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke={goal.color} strokeWidth="3"
                      strokeDasharray={`${pct * 0.88} 88`} strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{goal.label}</p>
                  <p className="text-xs text-muted-foreground">{goal.current}{goal.unit} / {goal.target}{goal.unit}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Progress */}
      <div className="bg-card rounded-2xl p-5 border border-border text-center">
        <h3 className="font-semibold text-foreground mb-4">Monthly Progress</h3>
        <div className="relative w-32 h-16 mx-auto overflow-hidden">
          <svg className="w-32 h-32 -mt-0" viewBox="0 0 100 50">
            <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="hsl(220 13% 91%)" strokeWidth="8" strokeLinecap="round" />
            <path
              d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="hsl(168 100% 37%)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${monthlyProgress * 1.26} 126`}
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-foreground mt-1">{monthlyProgress}%</p>
        <p className="text-xs text-muted-foreground">Overall Achievement</p>
      </div>

      {/* Scheduled */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Scheduled</h3>
        <div className="space-y-3">
          {schedule.map((s, i) => (
            <div key={i} className="flex items-center justify-between bg-muted rounded-xl p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{s.tag} - {s.title}</p>
                <p className="text-xs text-muted-foreground">{s.time}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
