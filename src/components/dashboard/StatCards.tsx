import { Footprints, Droplets, Flame, Heart } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StatCards = () => {
  const { watchConnected } = useIntegration();

  const [summary, setSummary] = useState<any>({
    total_calories_burned: 0,
    total_calories_eaten: 0,
    net_calories: 0,
  });

  useEffect(() => {
    api.getSummary().then(setSummary).catch(console.error);
  }, []);

  const cards = [
    {
      label: "Steps",
      value: "8,432",
      sub: "78% of daily goal",
      icon: Footprints,
      gradient: "stat-card-teal",
      progress: 78,
      watchTag: true,
    },
    {
      label: "Water",
      value: "2.4L",
      sub: "80% of daily goal",
      icon: Droplets,
      gradient: "stat-card-orange",
      progress: 80,
      watchTag: false,
    },
    {
      label: "Calories Burned",
      value: (summary?.total_calories_burned ?? 0).toLocaleString(),
      sub: "kcal burned today",
      icon: Flame,
      gradient: "stat-card-pink",
      progress: Math.min((summary.total_calories_burned / 2400) * 100, 100),
      watchTag: true,
    },
    {
      label: "Calories Eaten",
      value: (summary?.total_calories_eaten ?? 0).toLocaleString(),
      sub: "kcal eaten today",
      icon: Heart,
      gradient: "stat-card-purple",
      progress: Math.min((summary.total_calories_eaten / 2400) * 100, 100),
      watchTag: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.gradient} rounded-2xl p-5 text-primary-foreground relative overflow-hidden`}>
          {watchConnected && card.watchTag && (
            <span className="absolute top-3 right-3 text-[10px] bg-primary-foreground/20 backdrop-blur-sm rounded-full px-2 py-0.5">
              ⌚ Watch
            </span>
          )}
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
