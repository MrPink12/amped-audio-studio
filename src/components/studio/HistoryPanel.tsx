import { useRef, useEffect, useState } from "react";
import {
  Clock, CheckCircle, AlertCircle, Loader2,
  Play, Trash2, Download, X,
} from "lucide-react";
import type { HistoryItem } from "@/types/vunox";
import type { AudioPlayerState } from "@/hooks/useAudioPlayer";
import { getDownloadUrl, deleteHistoryItem } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface HistoryPanelProps {
  history: HistoryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  selectedItem: HistoryItem | null;
  onDelete: (id: string) => void;
  player: AudioPlayerState & {
    play: (id: string, url: string, label?: string) => void;
    stop: () => void;
    seek: (t: number) => void;
  };
}

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

const HistoryPanel = ({ history, selectedId, onSelect, selectedItem, onDelete, player }: HistoryPanelProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const prevLen = useRef(history.length);

  useEffect(() => {
    if (history.length > prevLen.current && listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevLen.current = history.length;
  }, [history.length]);

  const handleDelete = async (item: HistoryItem) => {
    try {
      await deleteHistoryItem(item.id, item.fileName);
      if (player.activeId === item.id) player.stop();
      onDelete(item.id);
      toast({ title: "Deleted", description: item.fileName ?? item.caption });
    } catch {
      toast({ title: "Delete failed", description: "Could not remove this item.", variant: "destructive" });
    }
    setConfirmDeleteId(null);
  };

  const handlePlay = (item: HistoryItem) => {
    if (!item.fileName) return;
    const label = `${item.taskType.toUpperCase()} — ${item.caption}`;
    player.play(item.id, getDownloadUrl(item.fileName), label);
  };

  return (
    <aside className="w-72 shrink-0 border-l border-border metal-panel flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-[11px] font-display uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          History / Output
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto" ref={listRef}>
        {history.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[11px] text-muted-foreground font-body">No generations yet.</p>
          </div>
        ) : (
          history.map((item) => {
            const hasFile = item.status === "success" && item.fileName;
            const isActive = player.activeId === item.id;
            const isConfirming = confirmDeleteId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left px-3 py-2 border-b border-border/30 transition-all duration-150 cursor-pointer
                  ${selectedId === item.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/20"}
                  ${isActive ? "ring-1 ring-inset ring-primary/20" : ""}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-display uppercase tracking-widest text-primary">
                    {item.taskType}
                  </span>
                  {statusIcon(item.status)}
                </div>
                <p className="text-[11px] font-body text-foreground/80 truncate">{item.caption}</p>
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

                {hasFile && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {/* Play in Global Player */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePlay(item); }}
                      className={`p-1 rounded transition-colors ${isActive && player.isPlaying ? "bg-primary/20 text-primary" : "hover:bg-primary/10 text-primary"}`}
                      title="Play in Global Player"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>

                    {/* Active indicator */}
                    {isActive && (
                      <span className="text-[8px] font-display uppercase tracking-widest text-primary animate-pulse">
                        {player.isPlaying ? "Playing" : "Loaded"}
                      </span>
                    )}

                    <div className="flex-1" />

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
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(item.id); }}
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

      {selectedItem && (
        <div className="border-t border-border p-3 max-h-48 overflow-y-auto">
          <h4 className="text-[10px] font-display uppercase tracking-widest text-primary mb-2">Details</h4>
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
