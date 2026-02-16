import { Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { HistoryItem } from "@/types/vunox";

interface HistoryPanelProps {
  history: HistoryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  selectedItem: HistoryItem | null;
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

const HistoryPanel = ({ history, selectedId, onSelect, selectedItem }: HistoryPanelProps) => (
  <aside className="w-72 shrink-0 border-l border-border metal-panel flex flex-col">
    <div className="px-4 py-3 border-b border-border">
      <h3 className="text-[11px] font-display uppercase tracking-[0.2em] text-primary flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" />
        History / Output
      </h3>
    </div>

    {/* List */}
    <div className="flex-1 overflow-y-auto">
      {history.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-[11px] text-muted-foreground font-body">No generations yet.</p>
        </div>
      ) : (
        history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full text-left px-4 py-2.5 border-b border-border/30 transition-all duration-150
              ${selectedId === item.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/20"}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-display uppercase tracking-widest text-primary">
                {item.taskType}
              </span>
              {statusIcon(item.status)}
            </div>
            <p className="text-[11px] font-body text-foreground/80 truncate">{item.caption}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] font-mono text-muted-foreground">
                {item.timestamp.toLocaleTimeString()}
              </span>
              {item.fileName && (
                <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[100px]">
                  {item.fileName}
                </span>
              )}
            </div>
          </button>
        ))
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

export default HistoryPanel;
