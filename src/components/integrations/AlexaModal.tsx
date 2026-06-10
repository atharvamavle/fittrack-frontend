import { Mic, X, Volume2 } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { say: "Alexa, open fit track", result: "Opens FitTrack skill" },
  { say: "I did chest and biceps", result: "Alexa asks for intensity" },
  { say: "Medium", result: "Logs workout + tells you calories burned" },
  { say: "I went for a run", result: "Logs running session" },
  { say: "What's my summary", result: "Today's calories burned & eaten" },
  { say: "I had chicken rice for lunch", result: "Logs a meal" },
];

const AlexaModal = ({ open, onClose }: Props) => {
  const { alexaConnected, connectAlexa, disconnectAlexa, alexaLastSync } = useIntegration();

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

        <h2 className="text-lg font-bold text-foreground mb-1">Amazon Alexa</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-2 h-2 rounded-full ${alexaConnected ? "bg-emerald-400" : "bg-destructive"}`} />
          <span className="text-sm text-muted-foreground">
            {alexaConnected ? `Connected · Last used: ${alexaLastSync}` : "Not Connected"}
          </span>
        </div>

        {/* Voice commands */}
        <div className="bg-muted rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Voice Commands</p>
          </div>
          {COMMANDS.map((cmd) => (
            <div key={cmd.say} className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">"{cmd.say}"</p>
              <p className="text-xs text-muted-foreground">→ {cmd.result}</p>
            </div>
          ))}
        </div>

        {!alexaConnected ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Your FitTrack Alexa skill is already set up on your account. Just enable it below.
            </p>
            <button
              onClick={() => { connectAlexa(); onClose(); }}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Mark as Connected
            </button>
          </div>
        ) : (
          <button
            onClick={() => { disconnectAlexa(); onClose(); }}
            className="w-full py-2.5 rounded-xl border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
          >
            Disconnect Alexa
          </button>
        )}
      </div>
    </div>
  );
};

export default AlexaModal;
