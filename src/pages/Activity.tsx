import { useState } from "react";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Bike, Waves, StretchHorizontal, Footprints, Plus } from "lucide-react";

type Source = "Alexa" | "Watch" | "Manual";
type WorkoutType = "Running" | "Cycling" | "Swimming" | "Stretching" | "Strength" | "Yoga" | "Treadmill";

interface Entry {
  id: number; date: string; type: WorkoutType; duration: number; calories: number; intensity: number; source: Source;
}

const typeIcons: Record<string, React.ElementType> = {
  Running: Footprints, Cycling: Bike, Swimming: Waves, Stretching: StretchHorizontal,
  Strength: Dumbbell, Yoga: StretchHorizontal, Treadmill: Footprints,
};

const sourceTag = (s: Source) => {
  if (s === "Alexa") return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">🎙️ Alexa</span>;
  if (s === "Watch") return <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">⌚ Watch</span>;
  return <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">✏️ Manual</span>;
};

const dots = (n: number) => (
  <div className="flex gap-1">{Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`w-2 h-2 rounded-full ${i < n ? "bg-primary" : "bg-muted"}`} />
  ))}</div>
);

const mockData: Entry[] = [
  { id: 1, date: "2026-04-07", type: "Running", duration: 35, calories: 320, intensity: 4, source: "Watch" },
  { id: 2, date: "2026-04-07", type: "Yoga", duration: 45, calories: 150, intensity: 2, source: "Manual" },
  { id: 3, date: "2026-04-06", type: "Strength", duration: 50, calories: 400, intensity: 5, source: "Manual" },
  { id: 4, date: "2026-04-06", type: "Cycling", duration: 40, calories: 350, intensity: 3, source: "Watch" },
  { id: 5, date: "2026-04-05", type: "Swimming", duration: 30, calories: 280, intensity: 3, source: "Alexa" },
  { id: 6, date: "2026-04-05", type: "Treadmill", duration: 25, calories: 220, intensity: 4, source: "Watch" },
  { id: 7, date: "2026-04-04", type: "Stretching", duration: 20, calories: 80, intensity: 1, source: "Manual" },
  { id: 8, date: "2026-04-04", type: "Running", duration: 45, calories: 410, intensity: 5, source: "Alexa" },
  { id: 9, date: "2026-04-03", type: "Strength", duration: 55, calories: 450, intensity: 4, source: "Watch" },
  { id: 10, date: "2026-04-03", type: "Yoga", duration: 30, calories: 120, intensity: 2, source: "Manual" },
  { id: 11, date: "2026-04-02", type: "Cycling", duration: 60, calories: 500, intensity: 4, source: "Watch" },
  { id: 12, date: "2026-04-01", type: "Swimming", duration: 35, calories: 300, intensity: 3, source: "Alexa" },
];

const workoutTypes: WorkoutType[] = ["Running", "Cycling", "Swimming", "Stretching", "Strength", "Yoga", "Treadmill"];
const sources: Source[] = ["Alexa", "Watch", "Manual"];

const Activity = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [newType, setNewType] = useState<WorkoutType>("Running");
  const [newDuration, setNewDuration] = useState("30");
  const [newIntensity, setNewIntensity] = useState([3]);
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    api.getWorkouts().then((data) => {
      // Map backend fields to frontend shape
      const mapped = data.map((w: any) => ({
        id: w.id,
        date: w.performed_at?.slice(0, 10) ?? "",
        type: w.workout_type as WorkoutType,
        duration: w.duration_minutes,
        calories: Math.round(w.calories_burned || 0),
        intensity: w.intensity,
        source: w.source as Source,
      }));
      setEntries(mapped);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter(
    (e) => (filterType === "all" || e.type === filterType) && (filterSource === "all" || e.source === filterSource)
  );

  const addWorkout = async () => {
    const result = await api.logWorkout({
      workout_type: newType.toLowerCase(),
      duration_minutes: parseInt(newDuration) || 30,
      intensity: newIntensity[0],
      source: "manual",
    });
    setEntries([{
      id: result.id,
      date: new Date().toISOString().slice(0, 10),
      type: newType,
      duration: parseInt(newDuration) || 30,
      calories: Math.round(result.calories_burned || 0),
      intensity: newIntensity[0],
      source: "Manual",
    }, ...entries]);
    setOpen(false);
    setNewNotes("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Workout</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {workoutTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All sources" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Workout</th>
                  <th className="text-left p-3 font-medium">Duration</th>
                  <th className="text-left p-3 font-medium">Calories</th>
                  <th className="text-left p-3 font-medium">Intensity</th>
                  <th className="text-left p-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const Icon = typeIcons[e.type] || Dumbbell;
                  return (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-3 text-muted-foreground">{e.date}</td>
                      <td className="p-3 flex items-center gap-2 font-medium"><Icon className="w-4 h-4 text-primary" />{e.type}</td>
                      <td className="p-3">{e.duration} min</td>
                      <td className="p-3">{e.calories} kcal</td>
                      <td className="p-3">{dots(e.intensity)}</td>
                      <td className="p-3">{sourceTag(e.source)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md fade-in">
          <DialogHeader><DialogTitle>Add Workout</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Workout Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as WorkoutType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{workoutTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (mins)</Label>
              <Input type="number" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
            </div>
            <div>
              <Label>Intensity: {newIntensity[0]}/5</Label>
              <Slider min={1} max={5} step={1} value={newIntensity} onValueChange={setNewIntensity} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Optional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addWorkout}>Save Workout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activity;
