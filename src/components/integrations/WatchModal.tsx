import { Watch, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PLANNED = ["Steps", "Heart Rate", "Calories Burned", "Sleep"];

const WatchModal = ({ open, onClose }: Props) => {
  if (!open) return null;

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

        <h2 className="text-lg font-bold text-foreground mb-1">Samsung Galaxy Watch</h2>
        <span className="inline-block text-xs font-medium bg-muted text-muted-foreground rounded-full px-2.5 py-1 mb-4">
          Coming soon
        </span>

        <p className="text-sm text-muted-foreground mb-4">
          Automatic watch sync via Health Connect is on the roadmap. Once it ships,
          FitTrack will pull this data without any manual logging:
        </p>

        <div className="bg-muted rounded-xl p-4 space-y-2 mb-4">
          {PLANNED.map((d) => (
            <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-purple" />
              <span>{d}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-accent transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WatchModal;
