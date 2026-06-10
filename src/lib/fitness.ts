// Shared fitness utilities used across components

export function melbourneToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

export function monthStart(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1)
    .toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

export function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
  });
}

export function shortDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-AU", { weekday: "short" });
}

export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export const goalLabels: Record<string, string> = {
  lose_weight:    "Lose Weight",
  build_muscle:   "Build Muscle",
  stay_fit:       "Stay Fit",
  improve_cardio: "Improve Cardio",
};

export const activityLabels: Record<string, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light:     "Lightly active (1–3 days/week)",
  moderate:  "Moderately active (3–5 days/week)",
  very:      "Very active (6–7 days/week)",
};

export const workoutTargets: Record<string, number> = {
  sedentary: 8,
  light:     12,
  moderate:  16,
  very:      24,
};
