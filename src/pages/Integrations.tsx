import { Mic, Watch } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";
import { useState } from "react";
import AlexaModal from "@/components/integrations/AlexaModal";
import WatchModal from "@/components/integrations/WatchModal";

const Integrations = () => {
  const { alexaConnected, alexaDevices, alexaLoading } = useIntegration();
  const [alexaOpen, setAlexaOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-foreground mb-1">Integrations</h2>
      <p className="text-sm text-muted-foreground mb-6">Connect your devices and services to enhance your fitness tracking.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Alexa */}
        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col">
          <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-4">
            <Mic className="w-7 h-7 text-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Amazon Alexa</h3>
          <p className="text-sm text-muted-foreground mb-3">Log workouts & meals by voice</p>
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${alexaConnected ? "bg-emerald-400" : "bg-destructive"}`} />
            <span className="text-sm text-muted-foreground">
              {alexaLoading
                ? "Checking…"
                : alexaConnected
                  ? `Linked (${alexaDevices.length} device${alexaDevices.length !== 1 ? "s" : ""})`
                  : "Not linked"}
            </span>
          </div>
          <button
            onClick={() => setAlexaOpen(true)}
            className="mt-auto w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {alexaConnected ? "Manage Alexa" : "Link Alexa"}
          </button>
        </div>

        {/* Watch — roadmap */}
        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col opacity-90">
          <div className="w-14 h-14 rounded-2xl bg-purple-light flex items-center justify-center mb-4">
            <Watch className="w-7 h-7 text-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Samsung Galaxy Watch</h3>
          <p className="text-sm text-muted-foreground mb-3">Auto-sync steps, heart rate & calories</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm text-muted-foreground">Coming soon</span>
          </div>
          <button
            onClick={() => setWatchOpen(true)}
            className="mt-auto w-full py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-accent transition-colors"
          >
            Learn more
          </button>
        </div>
      </div>

      <AlexaModal open={alexaOpen} onClose={() => setAlexaOpen(false)} />
      <WatchModal open={watchOpen} onClose={() => setWatchOpen(false)} />
    </div>
  );
};

export default Integrations;
