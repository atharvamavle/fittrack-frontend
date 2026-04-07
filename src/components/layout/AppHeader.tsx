import { Bell, Plus, Mic, Watch } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AlexaModal from "@/components/integrations/AlexaModal";
import WatchModal from "@/components/integrations/WatchModal";

const AppHeader = () => {
  const { alexaConnected, watchConnected } = useIntegration();
  const [alexaOpen, setAlexaOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 md:px-8 py-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Good Morning, Welcome Back 👋</h1>
          <p className="text-sm text-muted-foreground">Here's your fitness overview for today</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlexaOpen(true)}
            className={cn(
              "relative w-9 h-9 rounded-xl flex items-center justify-center bg-muted transition-colors hover:bg-accent",
              alexaConnected && "pulse-green"
            )}
            title="Alexa"
          >
            <Mic className={cn("w-4 h-4", alexaConnected ? "text-emerald-500" : "text-muted-foreground")} />
          </button>
          <button
            onClick={() => setWatchOpen(true)}
            className={cn(
              "relative w-9 h-9 rounded-xl flex items-center justify-center bg-muted transition-colors hover:bg-accent",
              watchConnected && "pulse-green"
            )}
            title="Samsung Watch"
          >
            <Watch className={cn("w-4 h-4", watchConnected ? "text-emerald-500" : "text-muted-foreground")} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted text-muted-foreground hover:bg-accent transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
          </button>
          <div className="hidden md:flex items-center gap-3 ml-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Alex Johnson</p>
              <p className="text-xs text-muted-foreground">New York, USA</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple overflow-hidden flex items-center justify-center text-primary-foreground font-bold text-sm">
              AJ
            </div>
          </div>
        </div>
      </header>
      <AlexaModal open={alexaOpen} onClose={() => setAlexaOpen(false)} />
      <WatchModal open={watchOpen} onClose={() => setWatchOpen(false)} />
    </>
  );
};

export default AppHeader;
