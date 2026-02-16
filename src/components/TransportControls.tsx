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
    <div className="flex items-center gap-3 metal-panel metal-border rounded-lg p-3 metal-surface">
      <AnalogButton onClick={onPrev} title="Previous" size="sm">
        <SkipBack className="w-3.5 h-3.5" />
      </AnalogButton>

      <AnalogButton onClick={onStop} title="Stop" size="sm">
        <Square className="w-3 h-3" />
      </AnalogButton>

      {/* Main play - big chunky push button */}
      <button
        onClick={onPlay}
        title={isPlaying ? "Pause" : "Play"}
        className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95"
        style={{
          background: isPlaying
            ? `radial-gradient(ellipse at 40% 35%, hsl(45,85%,68%), hsl(43,78%,50%) 50%, hsl(40,70%,38%))`
            : `radial-gradient(ellipse at 40% 35%, hsl(0,0%,26%), hsl(0,0%,16%) 50%, hsl(0,0%,10%))`,
          boxShadow: isPlaying
            ? `0 0 20px hsl(43 80% 55% / 0.25), 
               inset 0 2px 3px rgba(255,255,255,0.3), 
               inset 0 -3px 6px rgba(0,0,0,0.3),
               0 4px 8px rgba(0,0,0,0.5),
               0 1px 2px rgba(0,0,0,0.3)`
            : `inset 0 2px 3px rgba(255,255,255,0.08), 
               inset 0 -3px 6px rgba(0,0,0,0.4),
               0 4px 8px rgba(0,0,0,0.5),
               0 1px 2px rgba(0,0,0,0.3)`,
          color: isPlaying ? "hsl(0,0%,6%)" : "hsl(43,80%,55%)",
        }}
      >
        {/* Chrome ring around button */}
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            boxShadow: `inset 0 0 0 1.5px hsl(0,0%,${isPlaying ? 50 : 28}%)`,
          }}
        />
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
      </button>

      <AnalogButton onClick={() => {}} title="Record" size="sm" variant="record">
        <div className="w-3 h-3 rounded-full bg-current" />
      </AnalogButton>

      <AnalogButton onClick={onNext} title="Next" size="sm">
        <SkipForward className="w-3.5 h-3.5" />
      </AnalogButton>
    </div>
  );
};

const AnalogButton = ({ 
  onClick, children, title, size = "sm", variant = "default" 
}: { 
  onClick: () => void; children: React.ReactNode; title: string; size?: "sm" | "md"; variant?: "default" | "record";
}) => {
  const dim = size === "sm" ? 38 : 44;
  return (
    <button
      onClick={onClick}
      title={title}
      className="rounded-full flex items-center justify-center transition-all duration-150 active:scale-95"
      style={{
        width: dim,
        height: dim,
        background: `radial-gradient(ellipse at 40% 35%, hsl(0,0%,26%), hsl(0,0%,14%) 60%, hsl(0,0%,9%))`,
        boxShadow: `
          inset 0 1.5px 2px rgba(255,255,255,0.07),
          inset 0 -2px 4px rgba(0,0,0,0.4),
          0 3px 6px rgba(0,0,0,0.45),
          0 1px 2px rgba(0,0,0,0.3)
        `,
        color: variant === "record" ? "hsl(0,55%,50%)" : "hsl(0,0%,50%)",
      }}
    >
      {children}
    </button>
  );
};

export default TransportControls;
