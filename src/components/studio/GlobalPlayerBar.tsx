import { Play, Pause, Square } from "lucide-react";
import type { AudioPlayerState } from "@/hooks/useAudioPlayer";

interface GlobalPlayerBarProps {
  player: AudioPlayerState & {
    play: (id: string, url: string, label?: string) => void;
    stop: () => void;
    seek: (t: number) => void;
  };
}

const fmtTime = (s: number) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* Single analog-style VU needle meter */
const VuNeedle = ({ level, label }: { level: number; label: string }) => {
  const needleAngle = -45 + (level / 100) * 90;
  return (
    <div className="flex flex-col items-center w-20">
      <div className="w-full aspect-[2/1] relative overflow-hidden rounded-t"
        style={{
          background: "linear-gradient(180deg, hsl(40,30%,78%) 0%, hsl(38,25%,68%) 100%)",
        }}
      >
        {/* Scale markings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="xMidYMax meet">
          {/* Arc */}
          <path d="M 10 48 A 45 45 0 0 1 90 48" fill="none" stroke="hsl(0,0%,20%)" strokeWidth="0.8" />
          {/* Red zone */}
          <path d="M 75 48 A 45 45 0 0 1 90 48" fill="none" stroke="hsl(0,60%,45%)" strokeWidth="1.2" />
          {/* Tick marks */}
          {[0, 20, 40, 60, 72, 85, 100].map((pct, i) => {
            const ang = (-45 + pct * 0.9) * (Math.PI / 180);
            const cx = 50, cy = 50, r = 42;
            const ox = cx + Math.cos(ang - Math.PI / 2) * r;
            const oy = cy + Math.sin(ang - Math.PI / 2) * r;
            const ix = cx + Math.cos(ang - Math.PI / 2) * (r - 5);
            const iy = cy + Math.sin(ang - Math.PI / 2) * (r - 5);
            return <line key={i} x1={ox} y1={oy} x2={ix} y2={iy} stroke={pct > 72 ? "#a33" : "#333"} strokeWidth="0.6" />;
          })}
          {/* VU label */}
          <text x="50" y="42" fill="hsl(0,0%,20%)" fontSize="6" fontFamily="Oswald" fontWeight="600" textAnchor="middle">VU</text>
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 h-[80%] w-[1px] origin-bottom"
          style={{
            transform: `translateX(-50%) rotate(${needleAngle}deg)`,
            transition: "transform 120ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="w-full h-full" style={{ background: "linear-gradient(to top, hsl(0,0%,15%), hsl(0,0%,25%))" }} />
        </div>
        {/* Pivot */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: "radial-gradient(circle at 40% 35%, hsl(0,0%,45%), hsl(0,0%,20%))" }}
        />
      </div>
      <span className="text-[8px] font-display uppercase tracking-[0.2em] text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
};

const GlobalPlayerBar = ({ player }: GlobalPlayerBarProps) => {
  const hasTrack = !!player.activeId;
  const pct = player.duration ? (player.currentTime / player.duration) * 100 : 0;

  return (
    <div className="border-t border-border metal-panel">
      <div className="px-4 py-2 flex items-center gap-4">
        {/* Transport controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              if (hasTrack) player.play(player.activeId!, "", player.activeLabel);
            }}
            disabled={!hasTrack}
            className="w-8 h-8 rounded bg-secondary/60 border border-border flex items-center justify-center
              hover:bg-primary/20 hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={player.isPlaying ? "Pause" : "Play"}
          >
            {player.isPlaying
              ? <Pause className="w-4 h-4 text-primary" />
              : <Play className="w-4 h-4 text-primary" />}
          </button>
          <button
            onClick={() => player.stop()}
            disabled={!hasTrack}
            className="w-8 h-8 rounded bg-secondary/60 border border-border flex items-center justify-center
              hover:bg-primary/20 hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Stop"
          >
            <Square className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Track info + timeline */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Label */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-display uppercase tracking-widest text-foreground/80 truncate max-w-[300px]">
              {hasTrack ? player.activeLabel || "Untitled" : "No track loaded"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums shrink-0 ml-2">
              {fmtTime(player.currentTime)} / {fmtTime(player.duration)}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2 rounded-full bg-secondary/50 border border-border/40 cursor-pointer relative group"
            onClick={(e) => {
              if (!player.duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              player.seek((e.clientX - rect.left) / rect.width * player.duration);
            }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-75"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--gold-bright)))",
              }}
            />
            {/* Playhead dot */}
            {hasTrack && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary border border-primary-foreground/30 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${pct}% - 5px)` }}
              />
            )}
          </div>
        </div>

        {/* VU Meters */}
        <div className="flex items-end gap-2 shrink-0">
          <VuNeedle level={player.levelL} label="L" />
          <VuNeedle level={player.levelR} label="R" />
        </div>
      </div>
    </div>
  );
};

export default GlobalPlayerBar;
