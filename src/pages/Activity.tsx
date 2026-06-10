import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dumbbell, Bike, Waves, StretchHorizontal, Footprints, Plus, Loader2,
  Trash2, CalendarDays, List, BarChart3, ChevronLeft, ChevronRight, Flame, Clock,
} from "lucide-react";

type WorkoutType =
  | "running" | "cycling" | "swimming" | "stretching" | "strength"
  | "yoga" | "treadmill" | "chest" | "back" | "shoulders" | "arms"
  | "biceps" | "triceps" | "legs" | "abs";

interface Entry {
  id: number;
  date: string;
  type: string;
  duration: number;
  calories: number;
  intensity: number;
  source: string;
}

const typeIcons: Record<string, React.ElementType> = {
  running: Footprints, cycling: Bike, swimming: Waves,
  stretching: StretchHorizontal, strength: Dumbbell, yoga: StretchHorizontal,
  treadmill: Footprints, chest: Dumbbell, back: Dumbbell,
  shoulders: Dumbbell, arms: Dumbbell, abs: Dumbbell,
  biceps: Dumbbell, triceps: Dumbbell, legs: Dumbbell,
};

const typeColors: Record<string, string> = {
  running:    "bg-orange-100 text-orange-700",
  cycling:    "bg-blue-100 text-blue-700",
  swimming:   "bg-cyan-100 text-cyan-700",
  chest:      "bg-purple-100 text-purple-700",
  back:       "bg-indigo-100 text-indigo-700",
  shoulders:  "bg-pink-100 text-pink-700",
  arms:       "bg-red-100 text-red-700",
  biceps:     "bg-red-100 text-red-700",
  triceps:    "bg-rose-100 text-rose-700",
  legs:       "bg-green-100 text-green-700",
  abs:        "bg-yellow-100 text-yellow-700",
  yoga:       "bg-teal-100 text-teal-700",
  strength:   "bg-violet-100 text-violet-700",
  treadmill:  "bg-orange-100 text-orange-700",
  stretching: "bg-emerald-100 text-emerald-700",
};

const workoutTypes: WorkoutType[] = [
  "running", "cycling", "swimming", "stretching", "strength",
  "yoga", "treadmill", "chest", "back", "shoulders", "arms",
  "biceps", "triceps", "legs", "abs",
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function weekLabel(date: Date): string {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  const fmt = (dt: Date) => `${dt.getDate()} ${MONTH_NAMES[dt.getMonth()].slice(0, 3)}`;
  return `${fmt(d)} – ${fmt(end)}`;
}

function sourceTag(s: string) {
  const lower = (s || "").toLowerCase();
  if (lower === "alexa")
    return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">🎙️ Alexa</span>;
  if (lower === "watch")
    return <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">⌚ Watch</span>;
  return <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">✏️ Manual</span>;
}

function Dots({ n }: { n: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${i < n ? "bg-primary" : "bg-muted"}`} />
      ))}
    </div>
  );
}

const melbourneNow = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });

const Activity = () => {
  const [entries,      setEntries]      = useState<Entry[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [view,         setView]         = useState<"list" | "calendar" | "weekly">("list");
  const [calMonth,     setCalMonth]     = useState(() => new Date());
  const [selectedDay,  setSelectedDay]  = useState<string | null>(null);
  const [filterType,   setFilterType]   = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [open,         setOpen]         = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [deletingId,   setDeletingId]   = useState<number | null>(null);
  const [newType,      setNewType]      = useState<WorkoutType>("running");
  const [newDuration,  setNewDuration]  = useState("30");
  const [newIntensity, setNewIntensity] = useState([3]);

  const loadWorkouts = () => {
    setLoading(true);
    api.getWorkouts()
      .then((data) => {
        const mapped: Entry[] = (data || []).map((w: any) => ({
          id:        w.id,
          date:      w.date ?? "",
          type:      (w.workout_type || "").toLowerCase(),
          duration:  w.duration_minutes,
          calories:  Math.round(w.calories_burned || 0),
          intensity: w.intensity,
          source:    (w.source || "manual").toLowerCase(),
        }));
        mapped.sort((a, b) => (b.date > a.date ? 1 : -1));
        setEntries(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadWorkouts, []);

  const addWorkout = async () => {
    if (!newDuration) return;
    setSaving(true);
    try {
      const result = await api.logWorkout({
        workout_type:     newType,
        duration_minutes: parseInt(newDuration) || 30,
        intensity:        newIntensity[0],
        source:           "manual",
      });
      setEntries((prev) => [{
        id:        result.id,
        date:      result.date ?? melbourneNow(),
        type:      newType,
        duration:  parseInt(newDuration) || 30,
        calories:  Math.round(result.calories_burned || 0),
        intensity: newIntensity[0],
        source:    "manual",
      }, ...prev]);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.deleteWorkout(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Stats
  const today = melbourneNow();
  const nowD = new Date();
  const mondayOffset = nowD.getDay() === 0 ? 6 : nowD.getDay() - 1;
  const weekStartD = new Date(nowD);
  weekStartD.setDate(nowD.getDate() - mondayOffset);
  const weekStartStr = weekStartD.toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
  const thisWeek = entries.filter((e) => e.date >= weekStartStr && e.date <= today);

  // Calendar
  const calYear     = calMonth.getFullYear();
  const calMonthIdx = calMonth.getMonth();
  const firstDay    = new Date(calYear, calMonthIdx, 1).getDay();
  const daysInMonth = new Date(calYear, calMonthIdx + 1, 0).getDate();
  const workoutsByDate: Record<string, Entry[]> = {};
  entries.forEach((e) => {
    if (!workoutsByDate[e.date]) workoutsByDate[e.date] = [];
    workoutsByDate[e.date].push(e);
  });

  // Weekly grouping
  const weeklyGroups: Record<string, { label: string; entries: Entry[]; totalCal: number; totalMin: number }> = {};
  entries.forEach((e) => {
    if (!e.date) return;
    const dt  = new Date(e.date);
    const key = `${dt.getFullYear()}-W${String(getISOWeek(dt)).padStart(2, "0")}`;
    if (!weeklyGroups[key]) weeklyGroups[key] = { label: weekLabel(dt), entries: [], totalCal: 0, totalMin: 0 };
    weeklyGroups[key].entries.push(e);
    weeklyGroups[key].totalCal += e.calories;
    weeklyGroups[key].totalMin += e.duration;
  });
  const sortedWeeks = Object.entries(weeklyGroups).sort((a, b) => b[0].localeCompare(a[0]));

  const filtered = entries.filter((e) => {
    return (filterType === "all" || e.type === filterType) &&
           (filterSource === "all" || e.source === filterSource);
  });

  const WorkoutRow = ({ e, compact = false }: { e: Entry; compact?: boolean }) => {
    const Icon       = typeIcons[e.type] || Dumbbell;
    const colorClass = typeColors[e.type] || "bg-muted text-muted-foreground";
    return (
      <div className={`flex items-center gap-3 ${compact ? "px-4 py-3" : "p-4"} hover:bg-muted/30 transition-colors group`}>
        <div className={`${compact ? "w-8 h-8" : "w-10 h-10"} rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className={compact ? "w-4 h-4" : "w-5 h-5"} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-foreground capitalize ${compact ? "text-sm" : ""}`}>{e.type}</p>
          <p className="text-xs text-muted-foreground">{e.date}</p>
        </div>
        <div className="text-center hidden sm:block">
          <p className={`font-semibold text-foreground ${compact ? "text-sm" : ""}`}>{e.duration}m</p>
          <p className="text-xs text-muted-foreground">duration</p>
        </div>
        <div className="text-center hidden sm:block">
          <p className={`font-semibold text-foreground ${compact ? "text-sm" : ""}`}>{e.calories}</p>
          <p className="text-xs text-muted-foreground">kcal</p>
        </div>
        <div className="hidden md:block"><Dots n={e.intensity} /></div>
        <div>{sourceTag(e.source)}</div>
        <button
          onClick={() => handleDelete(e.id)}
          disabled={deletingId === e.id}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-destructive/10 text-destructive disabled:opacity-50"
        >
          {deletingId === e.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Workout
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-white">
          <Dumbbell className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{thisWeek.length}</p>
          <p className="text-xs opacity-80">Workouts this week</p>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 text-white">
          <Flame className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{thisWeek.reduce((s, e) => s + e.calories, 0)}</p>
          <p className="text-xs opacity-80">Calories this week</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-4 text-white">
          <Clock className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{thisWeek.reduce((s, e) => s + e.duration, 0)}</p>
          <p className="text-xs opacity-80">Minutes this week</p>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit">
        {([["list","List",List],["calendar","Calendar",CalendarDays],["weekly","Weekly",BarChart3]] as const).map(([v, label, Icon]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* LIST */}
      {view === "list" && (
        <>
          <div className="flex flex-wrap gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {workoutTypes.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All sources" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="alexa">Alexa</SelectItem>
                <SelectItem value="watch">Watch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Dumbbell className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">No workouts logged yet</p>
                  <p className="text-xs mt-1">Click "Add Workout" or ask Alexa</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filtered.map((e) => <WorkoutRow key={e.id} e={e} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* CALENDAR */}
      {view === "calendar" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx - 1))} className="p-2 rounded-lg hover:bg-muted">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-foreground">{MONTH_NAMES[calMonthIdx]} {calYear}</h2>
              <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx + 1))} className="p-2 rounded-lg hover:bg-muted">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES.map((d) => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }, (_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day     = i + 1;
                const dateStr = `${calYear}-${String(calMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayW    = workoutsByDate[dateStr] || [];
                const isToday    = dateStr === today;
                const isSelected = dateStr === selectedDay;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-all hover:bg-muted
                      ${isToday ? "ring-2 ring-primary" : ""}
                      ${isSelected ? "bg-primary text-primary-foreground" : ""}
                      ${dayW.length > 0 && !isSelected ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    <span>{day}</span>
                    {dayW.length > 0 && (
                      <div className="flex gap-0.5">
                        {dayW.slice(0, 3).map((_, j) => (
                          <span key={j} className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedDay && workoutsByDate[selectedDay] && (
              <div className="mt-6 border-t border-border pt-4 space-y-2">
                <h3 className="font-semibold text-foreground text-sm mb-3">{selectedDay}</h3>
                {workoutsByDate[selectedDay].map((e) => {
                  const Icon = typeIcons[e.type] || Dumbbell;
                  const colorClass = typeColors[e.type] || "bg-muted text-muted-foreground";
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold capitalize text-foreground">{e.type}</p>
                        <p className="text-xs text-muted-foreground">{e.duration} min · {e.calories} kcal · intensity {e.intensity}/5</p>
                      </div>
                      {sourceTag(e.source)}
                      <button onClick={() => handleDelete(e.id)} disabled={deletingId === e.id} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                        {deletingId === e.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* WEEKLY */}
      {view === "weekly" && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : sortedWeeks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Dumbbell className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No workouts yet</p>
            </div>
          ) : sortedWeeks.map(([key, week]) => (
            <Card key={key}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 rounded-t-xl">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{week.label}</p>
                    <p className="text-xs text-muted-foreground">{week.entries.length} workout{week.entries.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex gap-5 text-right">
                    <div>
                      <p className="text-sm font-bold text-foreground">{week.totalCal} kcal</p>
                      <p className="text-xs text-muted-foreground">burned</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{week.totalMin} min</p>
                      <p className="text-xs text-muted-foreground">total</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {week.entries.map((e) => <WorkoutRow key={e.id} e={e} compact />)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Workout</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Workout Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as WorkoutType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {workoutTypes.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (mins)</Label>
              <Input type="number" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
            </div>
            <div>
              <Label>Intensity: {newIntensity[0]}/5</Label>
              <Slider min={1} max={5} step={1} value={newIntensity} onValueChange={setNewIntensity} className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addWorkout} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activity;
