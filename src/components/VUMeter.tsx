import { useEffect, useState } from "react";

interface VUMeterProps {
  level: number; // 0-100
  label?: string;
  peak?: boolean;
}

const VUMeter = ({ level, label = "VU", peak = false }: VUMeterProps) => {
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    // Smooth animation
    const timer = setTimeout(() => setDisplayLevel(level), 50);
    return () => clearTimeout(timer);
  }, [level]);

  const segments = 20;
  const activeSegments = Math.round((displayLevel / 100) * segments);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="text-[10px] font-display uppercase tracking-[0.2em] text-cream/60">
          {label}
        </span>
      )}

      {/* Meter housing */}
      <div className="bg-background border border-border rounded-sm p-2 w-full">
        {/* Analog meter face */}
        <div className="relative h-16 bg-cream/5 rounded-sm overflow-hidden border border-border/50">
          {/* Scale markings */}
          <div className="absolute top-1 left-2 right-2 flex justify-between">
            <span className="text-[7px] font-mono text-muted-foreground">-20</span>
            <span className="text-[7px] font-mono text-muted-foreground">-10</span>
            <span className="text-[7px] font-mono text-muted-foreground">0</span>
            <span className="text-[7px] font-mono text-destructive/70">+3</span>
          </div>

          {/* Segment bar display */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-[2px] h-6">
            {Array.from({ length: segments }, (_, i) => {
              const isActive = i < activeSegments;
              const isRed = i >= segments * 0.75;
              const isYellow = i >= segments * 0.55 && !isRed;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-[1px] transition-all duration-75 ${
                    isActive
                      ? isRed
                        ? "bg-destructive led-glow-red"
                        : isYellow
                        ? "bg-primary led-glow-amber"
                        : "bg-led-green led-glow-green"
                      : "bg-border/30"
                  }`}
                />
              );
            })}
          </div>

          {/* Peak indicator */}
          {peak && displayLevel > 75 && (
            <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-destructive led-glow-red animate-pulse-glow" />
          )}
        </div>
      </div>

      {/* dB readout */}
      <div className="font-mono text-[11px] text-primary/80 tabular-nums">
        {displayLevel > 0 ? `${(((displayLevel / 100) * 23) - 20).toFixed(1)} dB` : "-∞ dB"}
      </div>
    </div>
  );
};

export default VUMeter;
