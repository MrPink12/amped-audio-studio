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
    <div className="flex items-center gap-2 metal-panel metal-border rounded-lg p-2.5 metal-surface">
      <TransportButton onClick={onPrev} title="Previous">
        <SkipBack className="w-4 h-4" />
      </TransportButton>
      
      <TransportButton onClick={onStop} title="Stop">
        <Square className="w-3.5 h-3.5" />
      </TransportButton>

      {/* Main play button - gold accent */}
      <button
        onClick={onPlay}
        title={isPlaying ? "Pause" : "Play"}
        className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: isPlaying
            ? "radial-gradient(ellipse at 35% 30%, hsl(45,85%,72%), hsl(40,75%,45%))"
            : "radial-gradient(ellipse at 35% 30%, hsl(0,0%,30%), hsl(0,0%,14%))",
          boxShadow: isPlaying
            ? "0 0 15px hsl(43 80% 55% / 0.3), 0 0 30px hsl(43 80% 55% / 0.1), inset 0 1px 1px rgba(255,255,255,0.3), 0 3px 8px rgba(0,0,0,0.4)"
            : "inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.4)",
          color: isPlaying ? "hsl(0,0%,8%)" : "hsl(43,80%,55%)",
        }}
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
    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
    style={{
      background: "radial-gradient(ellipse at 35% 30%, hsl(0,0%,28%), hsl(0,0%,12%))",
      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4)",
      color: "hsl(0,0%,55%)",
    }}
  >
    {children}
  </button>
);

export default TransportControls;
