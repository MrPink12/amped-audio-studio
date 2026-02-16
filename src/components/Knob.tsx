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
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startValue = useRef(value);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

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

  // Generate tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Tick marks ring */}
      <div className="relative">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Tick marks */}
          {ticks.map((tick) => {
            const tickAngle = (tick / 10) * 270 - 135;
            const isActive = tick <= (value / max) * 10;
            return (
              <div
                key={tick}
                className="absolute top-1/2 left-1/2 origin-center"
                style={{
                  transform: `translate(-50%, -50%) rotate(${tickAngle}deg)`,
                }}
              >
                <div
                  className={`w-0.5 h-1.5 -mt-[calc(50%+8px)] mx-auto rounded-full transition-colors ${
                    isActive ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  style={{
                    transform: `translateY(-${size === "lg" ? 36 : size === "md" ? 28 : 20}px)`,
                  }}
                />
              </div>
            );
          })}

          {/* Knob body */}
          <div
            ref={knobRef}
            onMouseDown={handleMouseDown}
            className={`${sizeClasses[size]} rounded-full cursor-grab active:cursor-grabbing knob-shadow
              bg-gradient-to-b from-secondary to-background border-2 border-border
              flex items-center justify-center transition-shadow
              ${isDragging ? "gold-glow" : ""}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Pointer line */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Value display */}
      <span className="font-mono text-xs text-primary tabular-nums">
        {value.toFixed(1)}
      </span>

      {/* Label */}
      <span className="text-[10px] font-display uppercase tracking-[0.2em] text-cream/60">
        {label}
      </span>
    </div>
  );
};

export default Knob;
