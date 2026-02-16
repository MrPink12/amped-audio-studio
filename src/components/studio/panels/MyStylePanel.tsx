import { useState } from "react";
import { Plus, Trash2, Star, Edit2, Loader2, HelpCircle, Music } from "lucide-react";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextInput, StudioSelect } from "../shared/StudioInput";
import type { Board, StyleModel, TrainingMode, TrainingBudget } from "@/types/vunox";

interface Props {
  boards: Board[];
  styleModels: StyleModel[];
  addBoard: (name: string) => string;
  deleteBoard: (id: string) => void;
  addTrackToBoard: (boardId: string, fileName: string) => void;
  removeTrackFromBoard: (boardId: string, trackId: string) => void;
  updateTrackNotes: (boardId: string, trackId: string, notes: string) => void;
  createStyleModel: (name: string, boardId: string, mode: TrainingMode, budget: TrainingBudget) => string;
  toggleStyleModelFavorite: (id: string) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-display text-sm uppercase tracking-[0.15em] text-primary gold-text-glow mb-3">
    {children}
  </h3>
);

const MyStylePanel = ({
  boards,
  styleModels,
  addBoard,
  deleteBoard,
  addTrackToBoard,
  removeTrackFromBoard,
  updateTrackNotes,
  createStyleModel,
  toggleStyleModelFavorite,
}: Props) => {
  const [newBoardName, setNewBoardName] = useState("");
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [newTrackFileName, setNewTrackFileName] = useState("");

  // Create Style Model form
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelBoardId, setModelBoardId] = useState("");
  const [modelTrainingMode, setModelTrainingMode] = useState<TrainingMode>("quick_lora");
  const [modelBudget, setModelBudget] = useState<TrainingBudget>("30min");

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    addBoard(newBoardName.trim());
    setNewBoardName("");
  };

  const handleAddTrack = (boardId: string) => {
    if (!newTrackFileName.trim()) return;
    addTrackToBoard(boardId, newTrackFileName.trim());
    setNewTrackFileName("");
  };

  const handleCreateModel = () => {
    if (!modelName.trim() || !modelBoardId) return;
    createStyleModel(modelName.trim(), modelBoardId, modelTrainingMode, modelBudget);
    setModelName("");
    setModelBoardId("");
    setShowCreateModel(false);
  };

  const statusColor = (s: StyleModel["status"]) => {
    switch (s) {
      case "ready": return "text-primary";
      case "training": return "text-accent";
      case "failed": return "text-destructive";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="font-display text-lg uppercase tracking-[0.15em] text-primary gold-text-glow mb-1">
          My Style
        </h2>
        <p className="text-[11px] font-body text-muted-foreground">
          Manage moodboards, style models, and personalization settings.
        </p>
      </div>

      {/* A. Library & Boards */}
      <section className="metal-panel metal-border rounded-lg p-5 space-y-4">
        <SectionTitle>Library &amp; Boards</SectionTitle>

        {/* Board list */}
        {boards.map((board) => (
          <div key={board.id} className="p-3 rounded bg-secondary/30 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-display uppercase tracking-widest text-foreground">{board.name}</p>
                <p className="text-[9px] font-mono text-muted-foreground">
                  {board.tracks.length} track{board.tracks.length !== 1 ? "s" : ""} · {board.stats}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingBoardId(editingBoardId === board.id ? null : board.id)}
                  className="p-1.5 rounded hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
                  title="Edit"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteBoard(board.id)}
                  className="p-1.5 rounded hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Expanded track list */}
            {editingBoardId === board.id && (
              <div className="pl-3 border-l border-border space-y-2 mt-2">
                {board.tracks.map((track) => (
                  <div key={track.id} className="flex items-center gap-2">
                    <Music className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-[10px] font-mono text-foreground/80 flex-1 truncate">{track.fileName}</span>
                    <input
                      value={track.notes}
                      onChange={(e) => updateTrackNotes(board.id, track.id, e.target.value)}
                      placeholder="Notes..."
                      className="text-[10px] font-body bg-background border border-border/50 rounded px-2 py-0.5 w-28
                        text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
                    />
                    <button
                      onClick={() => removeTrackFromBoard(board.id, track.id)}
                      className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
                {/* Add track */}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    value={newTrackFileName}
                    onChange={(e) => setNewTrackFileName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTrack(board.id)}
                    placeholder="track_file.wav"
                    className="text-[10px] font-mono bg-background border border-border/50 rounded px-2 py-1 flex-1
                      text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
                  />
                  <button
                    onClick={() => handleAddTrack(board.id)}
                    className="text-[9px] font-display uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Create board */}
        <div className="flex items-end gap-2 pt-2">
          <div className="flex-1">
            <FieldLabel label="New Board Name">
              <StudioTextInput
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleCreateBoard()}
                placeholder="e.g. My Hyperpop Collection"
              />
            </FieldLabel>
          </div>
          <button
            onClick={handleCreateBoard}
            disabled={!newBoardName.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded font-display text-[10px]
              uppercase tracking-widest hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3 h-3" /> Create Board
          </button>
        </div>
      </section>

      {/* B. Style Models (LoRA-style) */}
      <section className="metal-panel metal-border rounded-lg p-5 space-y-4">
        <SectionTitle>Style Models (LoRA)</SectionTitle>

        {styleModels.map((model) => (
          <div key={model.id} className="flex items-center gap-3 p-3 rounded bg-secondary/30 border border-border/50">
            <button
              onClick={() => toggleStyleModelFavorite(model.id)}
              className={`p-1 rounded transition-colors ${model.favorite ? "text-primary" : "text-muted-foreground hover:text-primary/60"}`}
              title={model.favorite ? "Remove from Studio engines" : "Add to Studio engines"}
            >
              <Star className={`w-3.5 h-3.5 ${model.favorite ? "fill-primary" : ""}`} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-display uppercase tracking-widest text-foreground truncate">{model.name}</p>
              <p className="text-[9px] font-mono text-muted-foreground truncate">
                Board: {model.boardName} · {model.trainingMode === "quick_lora" ? "Quick" : "Full"} LoRA
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[9px] font-display uppercase tracking-widest ${statusColor(model.status)} flex items-center gap-1`}>
                {model.status === "training" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                {model.status}
              </span>
              <span className="text-[8px] font-mono text-muted-foreground/60">
                {model.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}

        {/* Create style model */}
        {!showCreateModel ? (
          <button
            onClick={() => setShowCreateModel(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded font-display text-[10px]
              uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> Create Style Model
          </button>
        ) : (
          <div className="p-4 rounded bg-secondary/20 border border-primary/20 space-y-3">
            <p className="text-[10px] font-display uppercase tracking-widest text-primary">New Style Model</p>
            <FieldLabel label="Model Name" required>
              <StudioTextInput value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="e.g. Hugo – Hyperpop v2" />
            </FieldLabel>
            <FieldLabel label="Source Board" required>
              <StudioSelect value={modelBoardId} onChange={(e) => setModelBoardId(e.target.value)}>
                <option value="">Select a board…</option>
                {boards.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </StudioSelect>
            </FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <FieldLabel label="Training Mode">
                <StudioSelect value={modelTrainingMode} onChange={(e) => setModelTrainingMode(e.target.value as TrainingMode)}>
                  <option value="quick_lora">Quick LoRA</option>
                  <option value="full_lora">Full LoRA</option>
                </StudioSelect>
              </FieldLabel>
              <FieldLabel label="Training Budget">
                <StudioSelect value={modelBudget} onChange={(e) => setModelBudget(e.target.value as TrainingBudget)}>
                  <option value="30min">~30 minutes</option>
                  <option value="1-2h">1–2 hours</option>
                  <option value="overnight">Overnight</option>
                </StudioSelect>
              </FieldLabel>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateModel}
                disabled={!modelName.trim() || !modelBoardId}
                className="px-4 py-2 bg-primary text-primary-foreground rounded font-display text-[10px]
                  uppercase tracking-widest hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Start Training
              </button>
              <button
                onClick={() => setShowCreateModel(false)}
                className="px-4 py-2 rounded font-display text-[10px] uppercase tracking-widest
                  text-muted-foreground hover:text-foreground border border-border hover:bg-secondary/30 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* C. Integration Overview */}
      <section className="metal-panel metal-border rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-primary" />
          <SectionTitle>How Style Works</SectionTitle>
        </div>
        <div className="space-y-2 text-[10px] font-body text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground/80">Boards</strong> are collections of your own tracks, used as moodboards for style reference.
            Upload 5–50 tracks that represent a consistent aesthetic, and the system will extract common style features.
          </p>
          <p>
            <strong className="text-foreground/80">Style Models</strong> are deeper, trained models (LoRA-style) based on your boards.
            Training a Style Model captures nuances that simple reference can't, giving you a persistent personal sound.
          </p>
          <p>
            <strong className="text-foreground/80">Engine / Style mode / Style influence</strong> (in the Studio header) control how these settings are applied during generation.
            Use "None" for no style, "Single track" for quick reference, "Board" for moodboard influence, or "Style model" for deep personalization.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MyStylePanel;
