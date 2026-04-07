import { Mic, X } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AlexaModal = ({ open, onClose }: Props) => {
  const { alexaConnected, connectAlexa, disconnectAlexa, alexaLastSync } = useIntegration();
  const [code, setCode] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-light flex items-center justify-center">
            <Mic className="w-6 h-6 text-teal" />
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-1">
          {alexaConnected ? "Manage Amazon Alexa" : "Connect Amazon Alexa"}
        </h2>

        {alexaConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-muted-foreground">Connected · Last used: {alexaLastSync}</span>
            </div>
            <div className="bg-muted rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Sample commands:</p>
              <p className="text-sm text-muted-foreground">"Alexa, log my workout"</p>
              <p className="text-sm text-muted-foreground">"Alexa, I ate chicken rice"</p>
            </div>
            <button
              onClick={() => { disconnectAlexa(); onClose(); }}
              className="w-full py-2.5 rounded-xl border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
            >
              Disconnect Alexa
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Log workouts & meals by voice</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Enable the FitTracker skill in your Alexa app</li>
              <li>Say: "Alexa, open FitTracker"</li>
              <li>Follow the voice prompts to link your account</li>
            </ol>
            <input
              type="text"
              placeholder="Skill linking code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { connectAlexa(); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Done – Mark as Connected
              </button>
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlexaModal;
