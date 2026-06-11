import { useState } from "react";
import { Mic, X, Volume2, Loader2, RefreshCw } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { say: "Alexa, open fit track", result: "Opens the FitTrack skill" },
  { say: "Link my account with code 123456", result: "Pairs this device with your account" },
  { say: "I did chest and biceps", result: "Alexa asks duration & intensity, then logs each workout" },
  { say: "I ate two chapatis with paneer curry and salad", result: "Splits into items, estimates calories & macros" },
  { say: "What's my summary", result: "Reads today's workouts, meals, calories & protein" },
];

const AlexaModal = ({ open, onClose }: Props) => {
  const { alexaConnected, alexaDevices, alexaLoading, disconnectAlexa, refreshAlexa } = useIntegration();
  const [code, setCode] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number>(10);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const generateCode = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await api.getAlexaLinkCode();
      setCode(res.code);
      setExpiresIn(res.expires_in_minutes ?? 10);
    } catch {
      setError("Couldn't generate a code. Check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleUnlink = async () => {
    await disconnectAlexa();
    setCode(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

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
          {alexaLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
          ) : (
            <span className={`w-2 h-2 rounded-full ${alexaConnected ? "bg-emerald-400" : "bg-destructive"}`} />
          )}
          <span className="text-sm text-muted-foreground">
            {alexaLoading
              ? "Checking link status…"
              : alexaConnected
                ? `Linked · ${alexaDevices.length} device${alexaDevices.length !== 1 ? "s" : ""}`
                : "Not linked"}
          </span>
          <button onClick={refreshAlexa} title="Refresh status" className="ml-auto text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {!alexaConnected && (
          <div className="space-y-3 mb-4">
            <p className="text-sm text-muted-foreground">
              Generate a one-time code, then say to your Alexa device:
            </p>
            <p className="text-sm font-medium text-foreground">
              "Alexa, open fit track" … "Link my account with code <span className="text-primary">{code ?? "······"}</span>"
            </p>

            {code ? (
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-3xl font-bold tracking-[0.4em] text-foreground">{code}</p>
                <p className="text-xs text-muted-foreground mt-2">Expires in {expiresIn} minutes · single use</p>
              </div>
            ) : null}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              onClick={generateCode}
              disabled={generating}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {generating ? "Generating…" : code ? "Generate a new code" : "Generate link code"}
            </button>
            <p className="text-xs text-muted-foreground">
              After linking, tap the refresh icon above — the status updates once Alexa confirms.
            </p>
          </div>
        )}

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

        {alexaConnected && (
          <button
            onClick={handleUnlink}
            className="w-full py-2.5 rounded-xl border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
          >
            Unlink all Alexa devices
          </button>
        )}
      </div>
    </div>
  );
};

export default AlexaModal;
