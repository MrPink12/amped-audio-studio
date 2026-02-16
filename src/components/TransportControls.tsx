import { Play, Pause, SkipBack, SkipForward, Square } from "lucide-react";

interface TransportControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const TransportControls = ({ isPlaying, onPlay, onStop, onPrev, onNext }: TransportControlsProps) => {
  return (
    <div className="flex items-center gap-1 bg-secondary/50 border border-border rounded-lg p-2">
      <TransportButton onClick={onPrev} title="Previous">
        <SkipBack className="w-4 h-4" />
      </TransportButton>
      
      <TransportButton onClick={onStop} title="Stop">
        <Square className="w-4 h-4" />
      </TransportButton>

      <button
        onClick={onPlay}
        title={isPlaying ? "Pause" : "Play"}
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200
          border-2 ${
            isPlaying
              ? "border-primary bg-primary/20 text-primary gold-glow"
              : "border-border bg-secondary/30 text-foreground hover:border-primary/50 hover:text-primary"
          }`}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>

      <TransportButton onClick={onNext} title="Next">
        <SkipForward className="w-4 h-4" />
      </TransportButton>
    </div>
  );
};

const TransportButton = ({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title: string }) => (
  <button
    onClick={onClick}
    title={title}
    className="w-8 h-8 rounded-md flex items-center justify-center border border-border
      bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200"
  >
    {children}
  </button>
);

export default TransportControls;
