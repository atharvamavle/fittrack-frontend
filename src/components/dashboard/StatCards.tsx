import { Footprints, Droplets, Flame, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StatCards = () => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api.getSummary().then(setSummary).catch(console.error);
  }, []);

  const burned = summary?.total_calories_burned ?? 0;
  const eaten  = summary?.total_calories_eaten  ?? 0;

  const cards = [
    {
      label: "Steps",
      value: "0",
      sub: "Connect watch to track",
      icon: Footprints,
      gradient: "stat-card-teal",
      progress: 0,
    },
    {
      label: "Water",
      value: "0 L",
      sub: "Water tracker coming soon",
      icon: Droplets,
      gradient: "stat-card-orange",
      progress: 0,
    },
    {
      label: "Calories Burned",
      value: burned.toLocaleString(),
      sub: "kcal burned today",
      icon: Flame,
      gradient: "stat-card-pink",
      progress: Math.min((burned / 2400) * 100, 100),
    },
    {
      label: "Calories Eaten",
      value: eaten.toLocaleString(),
      sub: "kcal eaten today",
      icon: Heart,
      gradient: "stat-card-purple",
      progress: Math.min((eaten / 2400) * 100, 100),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.gradient} rounded-2xl p-5 text-primary-foreground relative overflow-hidden`}>
          <card.icon className="w-8 h-8 opacity-80 mb-3" />
          <p className="text-2xl font-bold">{card.value}</p>
          <p className="text-xs opacity-80 mt-1">{card.sub}</p>
          <div className="mt-3 h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground/60 rounded-full transition-all"
              style={{ width: `${card.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
