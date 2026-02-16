import type { StyleMode, StyleEngineOption } from "@/types/vunox";
import { STYLE_MODES } from "@/types/vunox";

interface StyleContextBarProps {
  styleEngine: string;
  styleMode: StyleMode;
  styleInfluence: number;
  styleEngineOptions: StyleEngineOption[];
  /** If true, show a note about single-track mode and file uploads */
  showFileNote?: boolean;
}

const StyleContextBar = ({
  styleEngine,
  styleMode,
  styleInfluence,
  styleEngineOptions,
  showFileNote,
}: StyleContextBarProps) => {
  const engineLabel = styleEngineOptions.find((e) => e.value === styleEngine)?.label ?? styleEngine;
  const modeLabel = STYLE_MODES.find((m) => m.value === styleMode)?.label ?? styleMode;

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded bg-secondary/40 border border-border/50">
        <span className="text-[8px] font-display uppercase tracking-[0.2em] text-muted-foreground">Style context</span>
        <span className="text-[10px] font-mono text-foreground/70 bg-secondary/60 px-2 py-0.5 rounded border border-border/40">
          {engineLabel}
        </span>
        <span className="text-[10px] font-mono text-foreground/70 bg-secondary/60 px-2 py-0.5 rounded border border-border/40">
          {modeLabel}
        </span>
        <span className="text-[10px] font-mono text-primary tabular-nums">
          {styleInfluence}%
        </span>
      </div>
      {showFileNote && styleMode === "single_track" && (
        <p className="text-[9px] font-body text-muted-foreground/70 italic px-1">
          In Single track mode, the uploaded file can act as both source and style reference.
        </p>
      )}
    </div>
  );
};

export default StyleContextBar;
