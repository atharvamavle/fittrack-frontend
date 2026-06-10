import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function melbourneToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

function macroPercents(meal: any) {
  const c = meal.carbs_g   || 0;
  const p = meal.protein_g || 0;
  const f = meal.fat_g     || 0;
  const total = c + p + f;
  if (total === 0) return { carbs: 0, protein: 0, fat: 0 };
  return {
    carbs:   Math.round((c / total) * 100),
    protein: Math.round((p / total) * 100),
    fat:     Math.round((f / total) * 100),
  };
}

const MACRO_COLORS: Record<string, string> = {
  carbs:   "bg-purple",
  protein: "bg-teal",
  fat:     "bg-pink",
};

const DietMenu = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMeals()
      .then((data) => {
        const today = melbourneToday();
        setMeals((data || []).filter((m: any) => m.date === today));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h3 className="font-semibold text-foreground mb-4">Today's Meals</h3>

      {loading ? (
        <div className="h-20 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : meals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p className="text-sm">No meals logged today</p>
          <p className="text-xs mt-1">Go to Nutrition to log your meals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meals.slice(0, 3).map((meal) => {
            const macros = macroPercents(meal);
            return (
              <div key={meal.id} className="bg-muted rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground capitalize">{meal.food_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{meal.meal_type} · {meal.calories ? `${Math.round(meal.calories)} kcal` : "—"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{meal.source === "alexa" ? "🎙️ Alexa" : "✏️ Manual"}</span>
                </div>
                <div className="space-y-2">
                  {(["carbs", "protein", "fat"] as const).map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-14 capitalize">{key}</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${MACRO_COLORS[key]}`} style={{ width: `${macros[key]}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{macros[key]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DietMenu;
