const BASE: string = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = {

  // ── Meals ──────────────────────────────────────────
  getMeals: async () => {
    const res = await fetch(`${BASE}/meals`);
    return res.json();
  },

  logMeal: async (data: {
    meal_type: string;
    food_name: string;
    quantity_g: number;
    source?: string;
  }) => {
    const res = await fetch(`${BASE}/meals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  searchFood: async (query: string) => {
    const res = await fetch(`${BASE}/meals/search?query=${encodeURIComponent(query)}`);
    return res.json();
  },

  // ── Workouts ───────────────────────────────────────
  getWorkouts: async () => {
    const res = await fetch(`${BASE}/workouts`);
    return res.json();
  },

  logWorkout: async (data: {
    workout_type: string;
    duration_minutes: number;
    intensity: number;
    source?: string;
  }) => {
    const res = await fetch(`${BASE}/workouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ── Summary ────────────────────────────────────────
  getSummary: async () => {
    const res = await fetch(`${BASE}/summary`);
    return res.json();
  },
};