import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { LogOut, User, Activity, Target, Ruler } from "lucide-react";

function cmToFeetInches(cm: number): string {
  const inches = cm / 2.54;
  const feet   = Math.floor(inches / 12);
  const rem    = Math.round(inches % 12);
  return `${feet}'${rem}" (${cm} cm)`;
}

const goalLabels: Record<string, string> = {
  lose_weight:    "Lose Weight",
  build_muscle:   "Build Muscle",
  stay_fit:       "Stay Fit",
  improve_cardio: "Improve Cardio",
};

const activityLabels: Record<string, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light:     "Lightly active (1–3 days/week)",
  moderate:  "Moderately active (3–5 days/week)",
  very:      "Very active (6–7 days/week)",
};

const Settings = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Account */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-4 h-4" /> Account
        </h2>
        <div className="space-y-2 text-sm">
          <Row label="Email"   value={user?.email ?? "—"} />
          <Row label="User ID" value={user?.id ? `${user.id.slice(0, 16)}…` : "—"} mono />
        </div>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Ruler className="w-4 h-4" /> Body Stats
        </h2>
        {!profile ? (
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        ) : (
          <div className="space-y-2 text-sm">
            <Row label="Name"   value={profile.name   ?? "—"} />
            <Row label="Age"    value={profile.age    ? `${profile.age} yrs` : "—"} />
            <Row label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : "—"} />
            <Row label="Height" value={profile.height_cm ? cmToFeetInches(profile.height_cm) : "—"} />
            <Row label="Gender" value={profile.gender ?? "—"} />
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" /> Goals
        </h2>
        {!profile ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="space-y-2 text-sm">
            <Row label="Goal"           value={goalLabels[profile.goal]          ?? profile.goal          ?? "—"} />
            <Row label="Activity Level" value={activityLabels[profile.activity_level] ?? profile.activity_level ?? "—"} />
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Session
        </h2>
        <Button variant="destructive" onClick={signOut} className="gap-2">
          <LogOut className="w-4 h-4" /> Sign out
        </Button>
      </div>
    </div>
  );
};

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-foreground font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

export default Settings;
