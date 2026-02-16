import { useEffect, useState } from "react";

interface VUMeterProps {
  level: number; // 0-100
  label?: string;
}

const VUMeter = ({ level, label = "VU" }: VUMeterProps) => {
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayLevel(level), 50);
    return () => clearTimeout(timer);
  }, [level]);

  // Needle rotation: -45deg (silence) to +45deg (max)
  const needleAngle = -45 + (displayLevel / 100) * 90;

  // Scale marks from -20 to +3
  const scaleMarks = [
    { label: "-20", angle: -42 },
    { label: "-10", angle: -28 },
    { label: "-7", angle: -18 },
    { label: "-5", angle: -10 },
    { label: "-3", angle: -2 },
    { label: "0", angle: 12 },
    { label: "+1", angle: 22 },
    { label: "+2", angle: 32 },
    { label: "+3", angle: 42 },
  ];

  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      )}

      {/* Meter face */}
      <div className="relative w-full aspect-[2/1] bg-foreground/95 rounded-t-full overflow-hidden border border-border">
        {/* Cream/white meter face */}
        <div className="absolute inset-[3px] rounded-t-full bg-gradient-to-b from-[hsl(40,20%,90%)] to-[hsl(40,15%,82%)]" />

        {/* VU text */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 text-[9px] font-display tracking-[0.3em] text-[hsl(0,0%,20%)] uppercase">
          VU
        </div>

        {/* Scale arc marks */}
        {scaleMarks.map((mark, i) => {
          const rad = (mark.angle - 90) * (Math.PI / 180);
          const r = 72;
          const cx = 50 + Math.cos(rad) * (r - 8);
          const cy = 95 + Math.sin(rad) * (r - 8);
          const tx = 50 + Math.cos(rad) * (r - 18);
          const ty = 95 + Math.sin(rad) * (r - 18);
          const tickEnd = r - 2;
          const tcx = 50 + Math.cos(rad) * tickEnd;
          const tcy = 95 + Math.sin(rad) * tickEnd;
          const isRed = i >= 5; // 0dB and above

          return (
            <div key={mark.label} className="absolute inset-0">
              {/* Tick line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line
                  x1={`${cx}`} y1={`${cy}`} x2={`${tcx}`} y2={`${tcy}`}
                  stroke={isRed ? "hsl(0,60%,45%)" : "hsl(0,0%,25%)"}
                  strokeWidth="0.5"
                />
              </svg>
              {/* Label */}
              <span
                className="absolute text-[5px] font-mono"
                style={{
                  left: `${tx}%`,
                  top: `${ty}%`,
                  transform: "translate(-50%, -50%)",
                  color: isRed ? "hsl(0,60%,45%)" : "hsl(0,0%,30%)",
                }}
              >
                {mark.label}
              </span>
            </div>
          );
        })}

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 h-[70%] w-[1px] origin-bottom transition-transform duration-150 ease-out"
          style={{
            transform: `translateX(-50%) rotate(${needleAngle}deg)`,
          }}
        >
          <div className="w-[1.5px] h-full bg-gradient-to-t from-[hsl(0,0%,10%)] to-[hsl(0,0%,20%)] mx-auto" />
        </div>

        {/* Needle pivot */}
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(0,0%,15%)] border border-[hsl(0,0%,30%)]" />
      </div>

      {/* dB readout */}
      <div className="font-mono text-[11px] text-primary/80 tabular-nums">
        {displayLevel > 0 ? `${(((displayLevel / 100) * 23) - 20).toFixed(1)} dB` : "-∞ dB"}
      </div>
    </div>
  );
};

export default VUMeter;
