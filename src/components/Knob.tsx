import { useState, useRef, useCallback } from "react";

interface KnobProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

const Knob = ({ label, value, min = 0, max = 10, onChange, size = "md" }: KnobProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startValue = useRef(value);

  const sizes = {
    sm: { outer: 48, gold: 28, ridges: 14 },
    md: { outer: 64, gold: 36, ridges: 18 },
    lg: { outer: 80, gold: 44, ridges: 22 },
  };

  const s = sizes[size];
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = (startY.current - e.clientY) / 100;
      const newValue = Math.min(max, Math.max(min, startValue.current + delta * (max - min)));
      onChange?.(Math.round(newValue * 10) / 10);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [value, min, max, onChange]);

  // Number of ridges on the black skirt
  const ridgeCount = s.ridges;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Knob assembly */}
      <div
        className="relative cursor-grab active:cursor-grabbing"
        style={{ width: s.outer, height: s.outer }}
        onMouseDown={handleMouseDown}
      >
        {/* Scale dots around the knob */}
        {Array.from({ length: 11 }, (_, i) => {
          const dotAngle = (i / 10) * 270 - 135;
          const rad = (dotAngle - 90) * (Math.PI / 180);
          const radius = s.outer / 2 + 6;
          const cx = s.outer / 2 + Math.cos(rad) * radius;
          const cy = s.outer / 2 + Math.sin(rad) * radius;
          const isActive = i <= (value / max) * 10;
          return (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full transition-colors ${
                isActive ? "bg-primary" : "bg-muted-foreground/25"
              }`}
              style={{ left: cx - 2, top: cy - 2 }}
            />
          );
        })}

        {/* Black ridged skirt */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${Array.from({ length: ridgeCount }, (_, i) => {
              const start = (i / ridgeCount) * 100;
              const mid = start + (100 / ridgeCount) * 0.4;
              const end = start + (100 / ridgeCount);
              return `hsl(0,0%,8%) ${start}%, hsl(0,0%,18%) ${mid}%, hsl(0,0%,6%) ${end}%`;
            }).join(", ")})`,
            boxShadow: `
              0 4px 12px rgba(0,0,0,0.6),
              0 2px 4px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -2px 4px rgba(0,0,0,0.5)
            `,
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          {/* Gold cap on top */}
          <div
            className="absolute rounded-full"
            style={{
              width: s.gold,
              height: s.gold,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: `
                radial-gradient(
                  ellipse at 35% 30%,
                  hsl(45, 85%, 72%) 0%,
                  hsl(43, 80%, 58%) 30%,
                  hsl(40, 75%, 45%) 60%,
                  hsl(38, 70%, 35%) 100%
                )
              `,
              boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.4),
                inset 0 -1px 2px rgba(0,0,0,0.3),
                0 1px 3px rgba(0,0,0,0.4)
              `,
            }}
          >
            {/* Indicator notch/line on gold cap */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: 3,
                width: 2,
                height: s.gold * 0.35,
                background: "hsl(0,0%,10%)",
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* Value */}
      <span className="font-mono text-xs text-primary tabular-nums">
        {value.toFixed(1)}
      </span>

      {/* Label */}
      <span className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

export default Knob;
