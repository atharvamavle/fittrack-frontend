import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Coffee, Sun, Moon, Cookie } from "lucide-react";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";
type Source = "Alexa" | "Manual";
interface FoodItem { name: string; calories: number; carbs: number; protein: number; fat: number; source: Source; }
type MealLog = Record<MealType, FoodItem[]>;

const mealIcons: Record<MealType, React.ElementType> = { Breakfast: Coffee, Lunch: Sun, Dinner: Moon, Snacks: Cookie };

const initialMeals: MealLog = {
  Breakfast: [
    { name: "Oatmeal with Berries", calories: 320, carbs: 45, protein: 12, fat: 8, source: "Manual" },
    { name: "Greek Yogurt", calories: 150, carbs: 10, protein: 18, fat: 5, source: "Alexa" },
  ],
  Lunch: [
    { name: "Grilled Chicken Salad", calories: 420, carbs: 15, protein: 38, fat: 22, source: "Manual" },
    { name: "Brown Rice", calories: 215, carbs: 45, protein: 5, fat: 2, source: "Manual" },
  ],
  Dinner: [
    { name: "Salmon Fillet", calories: 367, carbs: 0, protein: 34, fat: 22, source: "Manual" },
    { name: "Steamed Vegetables", calories: 85, carbs: 16, protein: 4, fat: 1, source: "Alexa" },
  ],
  Snacks: [
    { name: "Protein Bar", calories: 190, carbs: 20, protein: 15, fat: 8, source: "Manual" },
    { name: "Apple", calories: 100, carbs: 25, protein: 0, fat: 0, source: "Alexa" },
  ],
};

const sourceTag = (s: Source) =>
  s === "Alexa"
    ? <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">🎙️ Alexa</span>
    : <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">✏️ Manual</span>;

const Nutrition = () => {
  const [meals, setMeals] = useState<MealLog>(initialMeals);
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>("Breakfast");
  const [foodName, setFoodName] = useState("");
  const [cal, setCal] = useState("200");
  const [carbs, setCarbs] = useState("25");
  const [protein, setProtein] = useState("10");
  const [fat, setFat] = useState("8");

  const allItems = Object.values(meals).flat();
  const totalCal = allItems.reduce((s, i) => s + i.calories, 0);
  const totalCarbs = allItems.reduce((s, i) => s + i.carbs, 0);
  const totalProtein = allItems.reduce((s, i) => s + i.protein, 0);
  const totalFat = allItems.reduce((s, i) => s + i.fat, 0);
  const goal = 2400;

  const addMeal = () => {
    if (!foodName.trim()) return;
    setMeals((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType], { name: foodName, calories: +cal || 0, carbs: +carbs || 0, protein: +protein || 0, fat: +fat || 0, source: "Manual" as Source }],
    }));
    setOpen(false);
    setFoodName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Nutrition & Meals</h1>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Log Meal</Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span>Eaten: {totalCal.toLocaleString()} kcal</span>
            <span className="text-muted-foreground">Goal: {goal.toLocaleString()} kcal</span>
          </div>
          <Progress value={Math.min((totalCal / goal) * 100, 100)} className="h-3" />

          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "Carbs", value: totalCarbs, max: 300, color: "bg-purple-500" },
              { label: "Protein", value: totalProtein, max: 150, color: "bg-blue-500" },
              { label: "Fat", value: totalFat, max: 80, color: "bg-red-500" },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{m.label}</span><span>{m.value}g / {m.max}g</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.min((m.value / m.max) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {(Object.keys(meals) as MealType[]).map((type) => {
          const Icon = mealIcons[type];
          const mealCals = meals[type].reduce((s, i) => s + i.calories, 0);
          return (
            <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" /> {type}
                  <span className="ml-auto text-sm font-normal text-muted-foreground">{mealCals} kcal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meals[type].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">{item.calories} kcal</span>
                    </div>
                    {sourceTag(item.source)}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md fade-in">
          <DialogHeader><DialogTitle>Log Meal</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Meal Type</Label>
              <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Breakfast", "Lunch", "Dinner", "Snacks"] as MealType[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Food Name</Label><Input value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="e.g. Chicken Rice" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Calories</Label><Input type="number" value={cal} onChange={(e) => setCal(e.target.value)} /></div>
              <div><Label>Carbs (g)</Label><Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} /></div>
              <div><Label>Protein (g)</Label><Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} /></div>
              <div><Label>Fat (g)</Label><Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addMeal}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nutrition;
