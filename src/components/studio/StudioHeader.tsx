import { Zap, ChevronDown } from "lucide-react";
import LEDIndicator from "@/components/LEDIndicator";
import { ENGINES } from "@/types/vunox";
import type { StyleEngineOption } from "@/types/vunox";

interface StudioHeaderProps {
  engine: string;
  setEngine: (e: string) => void;
  isOnline: boolean;
  styleEngine: string;
  setStyleEngine: (e: string) => void;
  styleEngineOptions: StyleEngineOption[];
}

const StudioHeader = ({
  engine,
  setEngine,
  isOnline,
  styleEngine,
  setStyleEngine,
  styleEngineOptions,
}: StudioHeaderProps) => (
  <header className="border-b border-border metal-panel backdrop-blur-sm">
    <div className="px-4 py-3 flex items-center justify-between gap-4">
      {/* Left: brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-xl uppercase tracking-[0.15em] text-primary gold-text-glow">
            Vunox Studio
          </h1>
          <p className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground">
            Professional AI Music Production by P. Hagström
          </p>
        </div>
      </div>

      {/* Center: engine selector only */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-display uppercase tracking-[0.2em] text-muted-foreground">Engine</span>
          <div className="relative">
            <select
              value={styleEngine}
              onChange={(e) => setStyleEngine(e.target.value)}
              className="appearance-none bg-secondary border border-border rounded px-2 py-1 pr-6
                text-[10px] font-display uppercase tracking-widest text-foreground
                focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              {styleEngineOptions.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right: generation engine + health */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative">
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="appearance-none bg-secondary border border-border rounded px-3 py-1.5 pr-7
              text-[11px] font-display uppercase tracking-widest text-foreground
              focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            {ENGINES.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>

        <LEDIndicator
          active={isOnline}
          color="gold"
          size="md"
          label={isOnline ? "Online" : "Offline"}
        />
      </div>
    </div>
  </header>
);

export default StudioHeader;
