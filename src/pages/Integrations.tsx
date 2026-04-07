import { Mic, Watch } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";
import { useState } from "react";
import AlexaModal from "@/components/integrations/AlexaModal";
import WatchModal from "@/components/integrations/WatchModal";

const Integrations = () => {
  const { alexaConnected, watchConnected, alexaLastSync, watchLastSync } = useIntegration();
  const [alexaOpen, setAlexaOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);

  const cards = [
    {
      icon: Mic,
      title: "Amazon Alexa",
      subtitle: "Log workouts & meals by voice",
      connected: alexaConnected,
      lastSync: alexaLastSync,
      onAction: () => setAlexaOpen(true),
      gradient: "from-teal to-primary",
      bgLight: "bg-teal-light",
    },
    {
      icon: Watch,
      title: "Samsung Galaxy Watch",
      subtitle: "Auto-sync steps, heart rate & calories",
      connected: watchConnected,
      lastSync: watchLastSync,
      onAction: () => setWatchOpen(true),
      gradient: "from-purple to-pink",
      bgLight: "bg-purple-light",
    },
  ];

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-foreground mb-1">Integrations</h2>
      <p className="text-sm text-muted-foreground mb-6">Connect your devices and services to enhance your fitness tracking.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((card) => (
          <div key={card.title} className="bg-card rounded-2xl p-6 border border-border flex flex-col">
            <div className={`w-14 h-14 rounded-2xl ${card.bgLight} flex items-center justify-center mb-4`}>
              <card.icon className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{card.subtitle}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${card.connected ? "bg-emerald-400" : "bg-destructive"}`} />
              <span className="text-sm text-muted-foreground">{card.connected ? "Connected" : "Not Connected"}</span>
            </div>
            {card.connected && card.lastSync && (
              <p className="text-xs text-muted-foreground mb-4">Last synced: {card.lastSync}</p>
            )}
            <button
              onClick={card.onAction}
              className="mt-auto w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {card.connected ? `Manage ${card.title.split(" ")[0]}` : `Connect ${card.title.split(" ")[0]}`}
            </button>
          </div>
        ))}
      </div>

      <AlexaModal open={alexaOpen} onClose={() => setAlexaOpen(false)} />
      <WatchModal open={watchOpen} onClose={() => setWatchOpen(false)} />
    </div>
  );
};

export default Integrations;
