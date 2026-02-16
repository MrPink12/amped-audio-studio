import { ReactNode } from "react";

interface EffectPedalProps {
  name: string;
  active: boolean;
  onToggle: () => void;
  children: ReactNode;
  color?: string;
}

const EffectPedal = ({ name, active, onToggle, children, color }: EffectPedalProps) => {
  return (
    <div
      className={`relative metal-panel metal-border rounded-lg p-4 transition-all duration-300 metal-surface
        ${active ? "gold-glow" : "opacity-80"}`}
    >
      {/* Top label plate */}
      <div className="bg-secondary/50 rounded-sm px-3 py-1 mb-4 text-center border border-border/50">
        <span className="font-display text-sm uppercase tracking-[0.15em] text-primary">
          {name}
        </span>
      </div>

      {/* Controls area */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {children}
      </div>

      {/* Footswitch */}
      <button
        onClick={onToggle}
        className={`w-full py-2 rounded-md border-2 transition-all duration-200 font-display text-xs uppercase tracking-widest
          ${
            active
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
          }`}
      >
        {active ? "● ON" : "○ OFF"}
      </button>

      {/* Status LED */}
      <div className="absolute top-2 right-2">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-200
            ${active ? "bg-primary shadow-[0_0_6px_hsl(43_80%_55%/0.8)]" : "bg-primary/20"}`}
        />
      </div>
    </div>
  );
};

export default EffectPedal;
