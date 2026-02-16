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
        {/* Scale ticks around knob */}
        {Array.from({ length: 21 }, (_, i) => {
          const tickAngle = (i / 20) * 270 - 135;
          const rad = (tickAngle - 90) * (Math.PI / 180);
          const outerR = (s.outer + 16) / 2;
          const isMajor = i % 4 === 0;
          const innerR = outerR - (isMajor ? 5 : 3);
          const cx = outerR;
          const cy = outerR;
          return (
            <line
              key={i}
              x1={cx + Math.cos(rad) * innerR}
              y1={cy + Math.sin(rad) * innerR}
              x2={cx + Math.cos(rad) * outerR}
              y2={cy + Math.sin(rad) * outerR}
              stroke="hsl(0,0%,50%)"
              strokeWidth={isMajor ? "1" : "0.5"}
              style={{ position: "absolute" }}
            />
          );
        })}
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

        {/* Knob body - chrome/silver with brushed metal look */}
        <div
          className="absolute rounded-full"
          style={{
            width: s.outer,
            height: s.outer,
            top: 8,
            left: 8,
            background: `
              radial-gradient(
                ellipse at 40% 30%,
                hsl(0,0%,60%) 0%,
                hsl(0,0%,42%) 30%,
                hsl(0,0%,30%) 60%,
                hsl(0,0%,22%) 100%
              )
            `,
            boxShadow: `
              0 3px 10px rgba(0,0,0,0.5),
              0 1px 3px rgba(0,0,0,0.4),
              inset 0 1px 1px rgba(255,255,255,0.25),
              inset 0 -1px 2px rgba(0,0,0,0.4)
            `,
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          {/* Pointer line */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 4,
              width: 2,
              height: s.outer * 0.3,
              background: "hsl(0,0%,90%)",
              borderRadius: 1,
              boxShadow: "0 0 3px rgba(255,255,255,0.3)",
            }}
          />
        </div>
      </div>

      {/* Value readout */}
      <span className="font-mono text-[11px] text-primary tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export default Knob;
