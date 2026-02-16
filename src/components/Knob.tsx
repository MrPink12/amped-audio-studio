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
    sm: { outer: 40, notches: 32 },
    md: { outer: 54, notches: 40 },
    lg: { outer: 68, notches: 50 },
  };

  const s = sizes[size];
  const rotation = ((value - min) / (max - min)) * 270 - 135;
  const ridgeCount = size === "sm" ? 14 : size === "md" ? 18 : 22;

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

  const goldCap = s.outer * 0.55;

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      {/* Label on top */}
      <span className="text-[10px] font-display uppercase tracking-[0.2em] text-foreground/70">
        {label}
      </span>

      {/* Knob assembly */}
      <div
        className="relative cursor-grab active:cursor-grabbing"
        style={{ width: s.outer + 16, height: s.outer + 16 }}
        onMouseDown={handleMouseDown}
      >
        {/* Scale ticks */}
        <svg
          className="absolute inset-0"
          width={s.outer + 16}
          height={s.outer + 16}
          viewBox={`0 0 ${s.outer + 16} ${s.outer + 16}`}
        >
          {Array.from({ length: 21 }, (_, i) => {
            const tickAngle = (i / 20) * 270 - 135;
            const rad = (tickAngle - 90) * (Math.PI / 180);
            const outerR = (s.outer + 16) / 2 - 1;
            const isMajor = i % 4 === 0;
            const innerR = outerR - (isMajor ? 5 : 3);
            const cx = (s.outer + 16) / 2;
            const cy = (s.outer + 16) / 2;
            return (
              <line
                key={i}
                x1={cx + Math.cos(rad) * innerR}
                y1={cy + Math.sin(rad) * innerR}
                x2={cx + Math.cos(rad) * outerR}
                y2={cy + Math.sin(rad) * outerR}
                stroke="hsl(0,0%,45%)"
                strokeWidth={isMajor ? "1" : "0.5"}
              />
            );
          })}
        </svg>

        {/* Black ridged skirt */}
        <div
          className="absolute rounded-full"
          style={{
            width: s.outer,
            height: s.outer,
            top: 8,
            left: 8,
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
          {/* Gold cap */}
          <div
            className="absolute rounded-full"
            style={{
              width: goldCap,
              height: goldCap,
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
            {/* Indicator notch */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: 3,
                width: 2,
                height: goldCap * 0.35,
                background: "hsl(0,0%,10%)",
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* Value */}
      <span className="font-mono text-[11px] text-primary tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export default Knob;
