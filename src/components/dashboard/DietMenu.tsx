const meals = [
  {
    name: "Avocado Salad",
    time: "Breakfast · 8:30 AM",
    macros: { carbs: 35, protein: 25, fat: 40 },
  },
  {
    name: "Blueberry Smoothie",
    time: "Snack · 10:00 AM",
    macros: { carbs: 50, protein: 20, fat: 30 },
  },
];

const DietMenu = () => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h3 className="font-semibold text-foreground mb-4">Featured Diet Menu</h3>
      <div className="space-y-4">
        {meals.map((meal) => (
          <div key={meal.name} className="bg-muted rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{meal.name}</p>
                <p className="text-xs text-muted-foreground">{meal.time}</p>
              </div>
              <span className="text-xs text-muted-foreground">✏️ Manual</span>
            </div>
            <div className="space-y-2">
              {Object.entries(meal.macros).map(([key, val]) => {
                const colors: Record<string, string> = {
                  carbs: "bg-purple",
                  protein: "bg-teal",
                  fat: "bg-pink",
                };
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-14 capitalize">{key}</span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[key]}`} style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{val}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietMenu;
