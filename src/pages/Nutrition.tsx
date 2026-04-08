import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Coffee, Sun, Moon, Cookie, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface FoodItem {
  id: number;
  food_name: string;
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  meal_type: MealType;
  source: string;
}

const mealIcons: Record<string, React.ElementType> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

const sourceTag = (s: string) => {
  if (s === "alexa") return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">🎙️ Alexa</span>;
  if (s === "watch") return <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">⌚ Watch</span>;
  return <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">✏️ Manual</span>;
};

const Nutrition = () => {
  const [meals, setMeals] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

  // Form state
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [foodName, setFoodName] = useState("");
  const [quantityG, setQuantityG] = useState("100");
  const [cal, setCal] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");

  const goal = 2400;

  // Load meals from backend on mount
  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const data = await api.getMeals();
      setMeals(data);
    } catch (err) {
      console.error("Failed to load meals", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-lookup nutrition when user types a food name
  const handleFoodSearch = async () => {
    if (!foodName.trim()) return;
    setSearching(true);
    try {
      const data = await api.searchFood(foodName);
      if (data) {
        const factor = parseFloat(quantityG) / 100;
        setCal(String(Math.round(data.calories * factor)));
        setCarbs(String(Math.round(data.carbs_g * factor)));
        setProtein(String(Math.round(data.protein_g * factor)));
        setFat(String(Math.round(data.fat_g * factor)));
      }
    } catch {
      // Not found — user fills manually
    } finally {
      setSearching(false);
    }
  };

  const addMeal = async () => {
    if (!foodName.trim()) return;
    setSaving(true);
    try {
      await api.logMeal({
        meal_type: mealType,
        food_name: foodName,
        quantity_g: parseFloat(quantityG) || 100,
        source: "manual",
      });
      await loadMeals(); // refresh list from backend
      setOpen(false);
      setFoodName("");
      setCal(""); setCarbs(""); setProtein(""); setFat("");
    } catch (err) {
      console.error("Failed to log meal", err);
    } finally {
      setSaving(false);
    }
  };

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  const totalCal     = meals.reduce((s, i) => s + (i.calories || 0), 0);
  const totalCarbs   = meals.reduce((s, i) => s + (i.carbs_g || 0), 0);
  const totalProtein = meals.reduce((s, i) => s + (i.protein_g || 0), 0);
  const totalFat     = meals.reduce((s, i) => s + (i.fat_g || 0), 0);

  const mealsByType = (type: MealType) => meals.filter((m) => m.meal_type === type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Nutrition & Meals</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Log Meal
        </Button>
      </div>

      {/* Calorie summary bar */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span>Eaten: {totalCal.toLocaleString()} kcal</span>
            <span className="text-muted-foreground">Goal: {goal.toLocaleString()} kcal</span>
          </div>
          <Progress value={Math.min((totalCal / goal) * 100, 100)} className="h-3" />
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "Carbs",   value: Math.round(totalCarbs),   max: 300, color: "bg-purple-500" },
              { label: "Protein", value: Math.round(totalProtein), max: 150, color: "bg-blue-500" },
              { label: "Fat",     value: Math.round(totalFat),     max: 80,  color: "bg-red-500" },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{m.label}</span><span>{m.value}g / {m.max}g</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`}
                    style={{ width: `${Math.min((m.value / m.max) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meal cards by type */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {mealTypes.map((type) => {
            const Icon = mealIcons[type];
            const items = mealsByType(type);
            const mealCals = items.reduce((s, i) => s + (i.calories || 0), 0);
            return (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 capitalize">
                    <Icon className="w-4 h-4 text-primary" /> {type}
                    <span className="ml-auto text-sm font-normal text-muted-foreground">{mealCals} kcal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Nothing logged yet</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{item.food_name}</span>
                          <span className="text-muted-foreground ml-2">{item.calories} kcal</span>
                        </div>
                        {sourceTag(item.source)}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Log meal dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Log Meal</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Meal Type</Label>
              <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mealTypes.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Food Name</Label>
              <div className="flex gap-2">
                <Input
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Paneer masala curry"
                  onKeyDown={(e) => e.key === "Enter" && handleFoodSearch()}
                />
                <Button type="button" variant="outline" onClick={handleFoodSearch} disabled={searching}>
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Press Lookup — AI will auto-fill calories for you
              </p>
            </div>

            <div>
              <Label>Quantity (g)</Label>
              <Input type="number" value={quantityG} onChange={(e) => setQuantityG(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><Label>Calories</Label><Input type="number" value={cal} onChange={(e) => setCal(e.target.value)} placeholder="Auto" /></div>
              <div><Label>Carbs (g)</Label><Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Auto" /></div>
              <div><Label>Protein (g)</Label><Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Auto" /></div>
              <div><Label>Fat (g)</Label><Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Auto" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addMeal} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nutrition;