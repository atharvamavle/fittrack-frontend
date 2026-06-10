import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Bike, Waves, StretchHorizontal, Footprints, Plus, Loader2 } from "lucide-react";

type WorkoutType = "running" | "cycling" | "swimming" | "stretching" | "strength" | "yoga" | "treadmill" | "chest" | "back" | "shoulders" | "arms" | "abs";

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
};

function sourceTag(s: string) {
  const lower = (s || "").toLowerCase();
  if (lower === "alexa") return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">🎙️ Alexa</span>;
  if (lower === "watch") return <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">⌚ Watch</span>;
  return <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">✏️ Manual</span>;
}

function dots(n: number) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${i < n ? "bg-primary" : "bg-muted"}`} />
      ))}
    </div>
  );
}

const workoutTypes: WorkoutType[] = [
  "running", "cycling", "swimming", "stretching", "strength",
  "yoga", "treadmill", "chest", "back", "shoulders", "arms", "abs",
];

const Activity = () => {
  const [entries,      setEntries]      = useState<Entry[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [filterType,   setFilterType]   = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [open,         setOpen]         = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [newType,      setNewType]      = useState<WorkoutType>("running");
  const [newDuration,  setNewDuration]  = useState("30");
  const [newIntensity, setNewIntensity] = useState([3]);
  const [newNotes,     setNewNotes]     = useState("");

  const loadWorkouts = () => {
    setLoading(true);
    api.getWorkouts()
      .then((data) => {
        const mapped: Entry[] = (data || []).map((w: any) => ({
          id:        w.id,
          date:      w.date ?? "",           // use explicit date, not performed_at
          type:      (w.workout_type || "").toLowerCase(),
          duration:  w.duration_minutes,
          calories:  Math.round(w.calories_burned || 0),
          intensity: w.intensity,
          source:    (w.source || "manual").toLowerCase(),
        }));
        // Sort newest first
        mapped.sort((a, b) => (b.date > a.date ? 1 : -1));
        setEntries(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadWorkouts, []);

  const filtered = entries.filter((e) => {
    const typeOk   = filterType   === "all" || e.type   === filterType;
    const sourceOk = filterSource === "all" || e.source === filterSource;
    return typeOk && sourceOk;
  });

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
      const newEntry: Entry = {
        id:        result.id,
        date:      result.date ?? new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" }),
        type:      newType,
        duration:  parseInt(newDuration) || 30,
        calories:  Math.round(result.calories_burned || 0),
        intensity: newIntensity[0],
        source:    "manual",
      };
      setEntries([newEntry, ...entries]);
      setOpen(false);
      setNewNotes("");
    } catch (err) {
      console.error("Failed to log workout:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Workout
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {workoutTypes.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
            ))}
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
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Dumbbell className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No workouts logged yet</p>
              <p className="text-xs mt-1">Click "Add Workout" or ask Alexa to log one</p>
            </div>
          ) : (
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
                        <td className="p-3">
                          <div className="flex items-center gap-2 font-medium capitalize">
                            <Icon className="w-4 h-4 text-primary" />{e.type}
                          </div>
                        </td>
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
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Workout</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Workout Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as WorkoutType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {workoutTypes.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
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
            <div>
              <Label>Notes (optional)</Label>
              <Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Optional notes..." />
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
