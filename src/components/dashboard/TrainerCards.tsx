import { Star } from "lucide-react";

const trainers = [
  { name: "Sarah Miller", role: "Yoga & Pilates Specialist", rating: 4.9, initials: "SM", gradient: "from-teal to-primary" },
  { name: "James Cooper", role: "Strength & HIIT Coach", rating: 4.8, initials: "JC", gradient: "from-orange to-pink" },
];

const TrainerCards = () => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h3 className="font-semibold text-foreground mb-4">Recommended Trainer for you</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trainers.map((t) => (
          <div key={t.name} className="bg-muted rounded-xl p-4 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0`}>
              {t.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground truncate">{t.role}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-orange fill-orange" />
                <span className="text-xs font-medium text-foreground">{t.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerCards;
