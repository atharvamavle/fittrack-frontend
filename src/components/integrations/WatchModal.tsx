import { Watch, X, Check } from "lucide-react";
import { useIntegration } from "@/contexts/IntegrationContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const WatchModal = ({ open, onClose }: Props) => {
  const { watchConnected, connectWatch, disconnectWatch, watchLastSync } = useIntegration();

  if (!open) return null;

  const syncedData = ["Steps", "Heart Rate", "Calories Burned", "Sleep"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-light flex items-center justify-center">
            <Watch className="w-6 h-6 text-purple" />
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-1">
          {watchConnected ? "Manage Samsung Galaxy Watch" : "Connect Samsung Galaxy Watch"}
        </h2>

        {watchConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-muted-foreground">Connected · Last synced: {watchLastSync}</span>
            </div>
            <div className="bg-muted rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Synced data:</p>
              {syncedData.map((d) => (
                <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { disconnectWatch(); onClose(); }}
              className="w-full py-2.5 rounded-xl border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
            >
              Disconnect Watch
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Auto-sync steps, heart rate & calories</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open Samsung Health on your phone</li>
              <li>Go to Settings → Connected Services</li>
              <li>Allow Health Connect permissions</li>
              <li>Your data will sync automatically every 30 minutes</li>
            </ol>
            <button
              onClick={() => { connectWatch(); }}
              className="w-full py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-accent transition-colors"
            >
              🔄 Simulate Sync
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => { connectWatch(); onClose(); }}
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

export default WatchModal;
