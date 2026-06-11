import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Loader2, LogOut } from "lucide-react";
import { goalLabels, activityLabels, detectedTimezone } from "@/lib/fitness";

type Tab = "profile" | "body" | "goals" | "account";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "body",    label: "Body Stats" },
  { id: "goals",   label: "Goals" },
  { id: "account", label: "Account" },
];

const SECTION_COPY: Record<Tab, { title: string; desc: string }> = {
  profile: { title: "Profile",        desc: "Update your photo and personal details here." },
  body:    { title: "Body Stats",     desc: "Used to personalize your calorie and workout calculations." },
  goals:   { title: "Goals & Activity", desc: "Tell us what you're working toward." },
  account: { title: "Account",        desc: "Account details and session." },
};

const Settings = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");

  // Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [timezone, setTimezone] = useState("");

  const loadProfile = () => {
    setLoading(true);
    api.getProfile()
      .then((data) => {
        setProfile(data);
        setName(data?.name ?? "");
        setAge(data?.age ? String(data.age) : "");
        setWeight(data?.weight_kg ? String(data.weight_kg) : "");
        setHeight(data?.height_cm ? String(data.height_cm) : "");
        setGender(data?.gender ?? "other");
        setGoal(data?.goal ?? "stay_fit");
        setActivityLevel(data?.activity_level ?? "moderate");
        setTimezone(data?.timezone ?? detectedTimezone());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadProfile, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveProfile({
        name,
        weight_kg: parseFloat(weight) || 0,
        height_cm: parseFloat(height) || 0,
        age: parseInt(age) || 0,
        gender,
        goal,
        activity_level: activityLevel,
        timezone: timezone || detectedTimezone(),
      });
      setProfile((p: any) => ({
        ...p, name,
        age: parseInt(age) || 0,
        weight_kg: parseFloat(weight) || 0,
        height_cm: parseFloat(height) || 0,
        gender, goal, activity_level: activityLevel,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCancel = () => loadProfile();

  const initials = (profile?.name || user?.email || "?")
    .trim()
    .split(/\s+/)
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const showFooter = tab !== "account";
  const { title, desc } = SECTION_COPY[tab];

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Top tab bar */}
      <div className="border-b border-border">
        <div className="flex gap-6 overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors
                ${tab === id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div>
          {/* Section header */}
          <div className="pb-5 border-b border-border">
            <h2 className="font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </div>

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="divide-y divide-border">
              <Row label="Full name" desc="This is your display name across FitTrack.">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="max-w-sm" />
              </Row>
              <Row label="Email" desc="Used to sign in to your account.">
                <Input value={user?.email ?? ""} disabled className="max-w-sm text-muted-foreground" />
              </Row>
              <Row label="Your photo" desc="Generated automatically from your name.">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {initials}
                </div>
              </Row>
              <Row label="Timezone" desc="Daily summaries and Alexa logs use this to decide what 'today' means.">
                <div className="flex items-center gap-2 max-w-sm w-full">
                  <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g. Australia/Melbourne" />
                  <Button type="button" variant="outline" size="sm" onClick={() => setTimezone(detectedTimezone())} className="flex-shrink-0">
                    Detect
                  </Button>
                </div>
              </Row>
            </div>
          )}

          {/* BODY STATS */}
          {tab === "body" && (
            <div className="divide-y divide-border">
              <Row label="Age" desc="Your current age in years.">
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" className="max-w-sm" />
              </Row>
              <Row label="Gender" desc="Used for calorie calculations.">
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Weight" desc="Your current body weight in kilograms.">
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 75" className="max-w-sm" />
              </Row>
              <Row label="Height" desc="Your height in centimeters.">
                <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 178" className="max-w-sm" />
              </Row>
            </div>
          )}

          {/* GOALS */}
          {tab === "goals" && (
            <div className="divide-y divide-border">
              <Row label="Fitness goal" desc="What you're primarily training for.">
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(goalLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Activity level" desc="How active you are day-to-day.">
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>
            </div>
          )}

          {/* ACCOUNT */}
          {tab === "account" && (
            <div className="divide-y divide-border">
              <Row label="Email" desc="Used to sign in to your account.">
                <Input value={user?.email ?? ""} disabled className="max-w-sm text-muted-foreground" />
              </Row>
              <Row label="User ID" desc="Your unique FitTrack identifier.">
                <div className="flex items-center gap-2 max-w-sm">
                  <Input value={user?.id ?? ""} disabled className="font-mono text-xs text-muted-foreground" />
                  <button
                    onClick={handleCopyId}
                    className="p-2.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                    title="Copy user ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </Row>
              <Row label="Sign out" desc="End your session on this device.">
                <Button variant="destructive" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="w-4 h-4" /> Sign out
                </Button>
              </Row>
            </div>
          )}

          {/* Footer actions */}
          {showFooter && (
            <div className="flex items-center justify-end gap-3 pt-6">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[240px_1fr] gap-2 sm:gap-8 py-5">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

export default Settings;
