import { useRef, useEffect, useState } from "react";
import {
  Clock, CheckCircle, AlertCircle, Loader2,
  Play, Pause, Trash2, Download, X,
} from "lucide-react";
import type { HistoryItem } from "@/types/vunox";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { getDownloadUrl, deleteHistoryItem } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface HistoryPanelProps {
  history: HistoryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  selectedItem: HistoryItem | null;
  onDelete: (id: string) => void;
}

const fmtTime = (s: number) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const statusIcon = (status: HistoryItem["status"]) => {
  switch (status) {
    case "running":
      return <Loader2 className="w-3 h-3 text-primary animate-spin" />;
    case "success":
      return <CheckCircle className="w-3 h-3 text-primary" />;
    case "error":
      return <AlertCircle className="w-3 h-3 text-destructive" />;
    default:
      return <Clock className="w-3 h-3 text-muted-foreground" />;
  }
};

const HistoryPanel = ({ history, selectedId, onSelect, selectedItem, onDelete }: HistoryPanelProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const player = useAudioPlayer();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const prevLen = useRef(history.length);

  // Auto-scroll when new items arrive
  useEffect(() => {
    if (history.length > prevLen.current && listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevLen.current = history.length;
  }, [history.length]);

  const handleDelete = async (item: HistoryItem) => {
    try {
      await deleteHistoryItem(item.id, item.fileName);
      // Stop playback if deleting the playing item
      if (player.activeId === item.id) player.stop();
      onDelete(item.id);
      toast({ title: "Deleted", description: item.fileName ?? item.caption });
    } catch {
      toast({ title: "Delete failed", description: "Could not remove this item.", variant: "destructive" });
    }
    setConfirmDeleteId(null);
  };

  return (
    <aside className="w-72 shrink-0 border-l border-border metal-panel flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-[11px] font-display uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          History / Output
        </h3>
      </div>

      {/* Now-playing mini meter */}
      {player.activeId && (
        <div className="px-4 py-2 border-b border-border/50 space-y-1">
          {/* Level meter bar */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-muted-foreground w-6">LVL</span>
            <div className="flex-1 h-2 rounded-full bg-secondary/40 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${player.level}%`,
                  background: player.level > 80
                    ? "hsl(var(--destructive))"
                    : player.level > 50
                      ? "hsl(40, 90%, 55%)"
                      : "hsl(var(--primary))",
                }}
              />
            </div>
          </div>
          {/* Time progress */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-muted-foreground w-6">
              {fmtTime(player.currentTime)}
            </span>
            <div
              className="flex-1 h-1 rounded-full bg-secondary/40 cursor-pointer relative"
              onClick={(e) => {
                if (!player.duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                player.seek(pct * player.duration);
              }}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-100"
                style={{ width: `${player.duration ? (player.currentTime / player.duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-muted-foreground w-6 text-right">
              {fmtTime(player.duration)}
            </span>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto" ref={listRef}>
        {history.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[11px] text-muted-foreground font-body">No generations yet.</p>
          </div>
        ) : (
          history.map((item) => {
            const isPlaying = player.activeId === item.id && player.isPlaying;
            const hasFile = item.status === "success" && item.fileName;
            const isConfirming = confirmDeleteId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left px-3 py-2 border-b border-border/30 transition-all duration-150 cursor-pointer
                  ${selectedId === item.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/20"}`}
              >
                {/* Row 1: type + status */}
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-display uppercase tracking-widest text-primary">
                    {item.taskType}
                  </span>
                  {statusIcon(item.status)}
                </div>

                {/* Caption */}
                <p className="text-[11px] font-body text-foreground/80 truncate">{item.caption}</p>

                {/* Timestamp + file */}
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                  {item.fileName && (
                    <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[90px]">
                      {item.fileName}
                    </span>
                  )}
                </div>

                {/* Action row: play, download, delete */}
                {hasFile && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {/* Play/Pause */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        player.play(item.id, getDownloadUrl(item.fileName!));
                      }}
                      className="p-1 rounded hover:bg-primary/10 text-primary transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    {/* Per-item mini progress when this item is playing */}
                    {player.activeId === item.id && (
                      <div className="flex-1 h-1 rounded-full bg-secondary/30 mx-1">
                        <div
                          className="h-full rounded-full bg-primary/60 transition-all duration-100"
                          style={{ width: `${player.duration ? (player.currentTime / player.duration) * 100 : 0}%` }}
                        />
                      </div>
                    )}

                    {/* Spacer when not playing */}
                    {player.activeId !== item.id && <div className="flex-1" />}

                    {/* Download */}
                    <a
                      href={getDownloadUrl(item.fileName!)}
                      download={item.fileName}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete */}
                    {isConfirming ? (
                      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 rounded bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors"
                          title="Confirm delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-1 rounded hover:bg-secondary/30 text-muted-foreground transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(item.id);
                        }}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Detail sub-panel */}
      {selectedItem && (
        <div className="border-t border-border p-3 max-h-48 overflow-y-auto">
          <h4 className="text-[10px] font-display uppercase tracking-widest text-primary mb-2">
            Details
          </h4>
          <div className="space-y-1 text-[10px] font-mono text-muted-foreground">
            <p>Engine: {selectedItem.engine}</p>
            <p>Status: {selectedItem.status}</p>
            {selectedItem.fileName && <p>File: {selectedItem.fileName}</p>}
            {selectedItem.error && (
              <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/30">
                <p className="text-destructive font-display">{selectedItem.error.title}</p>
                <p className="text-destructive/80">{selectedItem.error.message}</p>
              </div>
            )}
            {selectedItem.params && (
              <pre className="mt-1 whitespace-pre-wrap text-[9px]">
                {JSON.stringify(selectedItem.params, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default HistoryPanel;
