import { supabase } from "@/lib/supabase";

const BASE: string = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Attach the Supabase JWT to every request
async function authHeaders(): Promise<HeadersInit> {
  // Try getSession first, then refreshSession as fallback
  let { data } = await supabase.auth.getSession();
  if (!data.session) {
    const refreshed = await supabase.auth.refreshSession();
    data = refreshed.data as any;
  }
  const token = data.session?.access_token;
  if (!token) console.warn("No auth token available for API request");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: await authHeaders() });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function post(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

import { melbourneToday } from "@/lib/fitness";

export const api = {
  // ── Meals ──────────────────────────────────────────────────────
  getMeals: () => get("/meals"),

  logMeal: (data: {
    meal_type: string;
    food_name: string;
    quantity_g: number;
    source?: string;
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  }) => post("/meals", { ...data, date: melbourneToday() }),

  searchFood: (query: string) => get(`/meals/search?query=${encodeURIComponent(query)}`),

  // ── Workouts ────────────────────────────────────────────────────
  getWorkouts: () => get("/workouts"),

  logWorkout: (data: {
    workout_type: string;
    duration_minutes: number;
    intensity: number;
    source?: string;
  }) => post("/workouts", { ...data, date: melbourneToday() }),

  // ── Summary ─────────────────────────────────────────────────────
  getSummary: (date?: string) =>
    get(`/summary${date ? `?date=${date}` : `?date=${melbourneToday()}`}`),

  // ── Chat ────────────────────────────────────────────────────────
  sendMessage: (message: string) => post("/chat", { message }),

  // ── User profile ─────────────────────────────────────────────
  getProfile: () => get("/users/profile"),

  saveProfile: (data: {
    name: string;
    weight_kg: number;
    height_cm: number;
    age: number;
    gender?: string;
    goal?: string;
    activity_level?: string;
  }) => post("/users/profile", data),
};
