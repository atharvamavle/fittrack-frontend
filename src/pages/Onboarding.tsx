import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Activity, Loader2, ChevronRight } from "lucide-react";
import { detectedTimezone } from "@/lib/fitness";

const goals = [
  { value: "lose_weight",    label: "Lose Weight",     emoji: "🔥" },
  { value: "build_muscle",   label: "Build Muscle",    emoji: "💪" },
  { value: "stay_fit",       label: "Stay Fit",        emoji: "⚡" },
  { value: "improve_cardio", label: "Improve Cardio",  emoji: "🏃" },
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name,       setName]       = useState("");
  const [weight,     setWeight]     = useState("");
  const [height,     setHeight]     = useState("");
  const [age,        setAge]        = useState("");
  const [gender,     setGender]     = useState("male");
  const [goal,       setGoal]       = useState("stay_fit");
  const [activityLevel, setActivityLevel] = useState("moderate");

  const submit = async () => {
    if (!name || !weight || !height || !age) {
      setError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Session before save:", sessionData.session?.access_token?.slice(0, 20));
      await api.saveProfile({
        name,
        weight_kg: parseFloat(weight),
        height_cm: parseFloat(height),
        age: parseInt(age),
        gender,
        goal,
        activity_level: activityLevel,
        timezone: detectedTimezone(),
      });
      navigate("/");
    } catch (e: any) {
      console.error("Profile save error:", e);
      setError(`Failed to save profile: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <Activity className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Set up your profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hi {user?.email?.split("@")[0]} 👋 — takes 30 seconds
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all ${s === step ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">

          {/* ── Step 1: Basic info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground text-lg">Basic info</h2>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Atharva"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 75"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <button
                onClick={() => {
                  if (!name || !weight || !height || !age) { setError("Fill in all fields."); return; }
                  setError(null); setStep(2);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Step 2: Goal + activity ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-foreground text-lg">Your goal</h2>

              <div className="grid grid-cols-2 gap-3">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      goal === g.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="text-2xl mb-1">{g.emoji}</div>
                    <div className="text-sm font-medium">{g.label}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Activity level</label>
                <div className="space-y-2">
                  {[
                    { value: "sedentary",  label: "Sedentary",         sub: "Little or no exercise" },
                    { value: "light",      label: "Lightly active",    sub: "1–3 days/week" },
                    { value: "moderate",   label: "Moderately active", sub: "3–5 days/week" },
                    { value: "very",       label: "Very active",       sub: "6–7 days/week" },
                  ].map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setActivityLevel(a.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                        activityLevel === a.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.label}</p>
                        <p className="text-xs text-muted-foreground">{a.sub}</p>
                      </div>
                      {activityLevel === a.value && (
                        <div className="w-4 h-4 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={submit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Let's go 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
