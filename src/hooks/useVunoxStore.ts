import { useState, useCallback, useMemo } from "react";
import type {
  SectionId, HistoryItem, TaskType, ToolType,
  StyleMode, Board, BoardTrack, StyleModel, StyleEngineOption,
  TrainingMode, TrainingBudget,
} from "@/types/vunox";
import { STYLE_ENGINES_BASE } from "@/types/vunox";

// Dummy boards for initial state
const INITIAL_BOARDS: Board[] = [
  {
    id: "board-1",
    name: "Hugo – Hyperpop Moodboard",
    tracks: [
      { id: "t1", fileName: "hugo_hyperpop_demo_01.wav", notes: "Main reference" },
      { id: "t2", fileName: "hugo_hyperpop_demo_02.wav", notes: "" },
      { id: "t3", fileName: "glitch_bass_loop.wav", notes: "Texture reference" },
    ],
    stats: "BPM: 130–145, minor keys, dark / emotional",
  },
  {
    id: "board-2",
    name: "Chill Acoustic Collection",
    tracks: [
      { id: "t4", fileName: "acoustic_sunrise.wav", notes: "Fingerpicking style" },
      { id: "t5", fileName: "folk_ballad_draft.wav", notes: "" },
    ],
    stats: "BPM: 85–100, major keys, warm / organic",
  },
];

const INITIAL_STYLE_MODELS: StyleModel[] = [
  {
    id: "sm-1",
    name: "Hugo – Hyperpop v1",
    boardId: "board-1",
    boardName: "Hugo – Hyperpop Moodboard",
    status: "ready",
    trainingMode: "quick_lora",
    trainingBudget: "30min",
    createdAt: new Date(Date.now() - 86400000 * 3),
    favorite: true,
  },
  {
    id: "sm-2",
    name: "Acoustic Warmth v1",
    boardId: "board-2",
    boardName: "Chill Acoustic Collection",
    status: "training",
    trainingMode: "full_lora",
    trainingBudget: "1-2h",
    createdAt: new Date(Date.now() - 3600000),
    favorite: false,
  },
];

export function useVunoxStore() {
  const [activeSection, setActiveSection] = useState<SectionId>("text2music");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [engine, setEngine] = useState("ace-step-v1.5");

  // Style state
  const [styleEngine, setStyleEngine] = useState("ace-step-base");
  const [styleMode, setStyleMode] = useState<StyleMode>("none");
  const [styleInfluence, setStyleInfluence] = useState(50);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [activeStyleModelId, setActiveStyleModelId] = useState<string | null>(null);

  // Boards & style models
  const [boards, setBoards] = useState<Board[]>(INITIAL_BOARDS);
  const [styleModels, setStyleModels] = useState<StyleModel[]>(INITIAL_STYLE_MODELS);

  // Derive engine options from base + favorite style models
  const styleEngineOptions: StyleEngineOption[] = useMemo(() => {
    const fromModels: StyleEngineOption[] = styleModels
      .filter((m) => m.favorite && m.status === "ready")
      .map((m) => ({ value: `lora-${m.id}`, label: `${m.name} (LoRA)`, isLora: true }));
    return [...STYLE_ENGINES_BASE, ...fromModels];
  }, [styleModels]);

  const addHistoryItem = useCallback(
    (taskType: TaskType | ToolType, caption: string, params?: Record<string, unknown>) => {
      const id = crypto.randomUUID();
      const item: HistoryItem = {
        id,
        timestamp: new Date(),
        taskType,
        engine,
        caption: caption.slice(0, 120),
        status: "running",
        params: {
          ...params,
          // TODO: include style context in backend payload:
          // style_engine: styleEngine,
          // style_mode: styleMode,
          // style_influence: styleInfluence,
          // board_id: activeBoardId,
          // style_model_id: activeStyleModelId,
        },
      };
      setHistory((prev) => [item, ...prev]);
      setSelectedHistoryId(id);

      // Simulate completion after 3s (will be replaced by real API)
      setTimeout(() => {
        setHistory((prev) =>
          prev.map((h) =>
            h.id === id
              ? { ...h, status: "success" as const, fileName: `output_${id.slice(0, 8)}.wav` }
              : h
          )
        );
      }, 3000);

      return id;
    },
    [engine, styleEngine, styleMode, styleInfluence, activeBoardId, activeStyleModelId]
  );

  // Board CRUD
  const addBoard = useCallback((name: string) => {
    const board: Board = {
      id: crypto.randomUUID(),
      name,
      tracks: [],
      stats: "No tracks yet",
    };
    setBoards((prev) => [...prev, board]);
    return board.id;
  }, []);

  const deleteBoard = useCallback((id: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addTrackToBoard = useCallback((boardId: string, fileName: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? { ...b, tracks: [...b.tracks, { id: crypto.randomUUID(), fileName, notes: "" }] }
          : b
      )
    );
  }, []);

  const removeTrackFromBoard = useCallback((boardId: string, trackId: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? { ...b, tracks: b.tracks.filter((t) => t.id !== trackId) }
          : b
      )
    );
  }, []);

  const updateTrackNotes = useCallback((boardId: string, trackId: string, notes: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? { ...b, tracks: b.tracks.map((t) => (t.id === trackId ? { ...t, notes } : t)) }
          : b
      )
    );
  }, []);

  // Style Model CRUD
  const createStyleModel = useCallback(
    (name: string, boardId: string, trainingMode: TrainingMode, trainingBudget: TrainingBudget) => {
      const board = boards.find((b) => b.id === boardId);
      const model: StyleModel = {
        id: crypto.randomUUID(),
        name,
        boardId,
        boardName: board?.name ?? "Unknown",
        status: "training",
        trainingMode,
        trainingBudget,
        createdAt: new Date(),
        favorite: false,
      };
      setStyleModels((prev) => [...prev, model]);

      // TODO: replace with real API call to start training
      // Simulate training completion
      setTimeout(() => {
        setStyleModels((prev) =>
          prev.map((m) => (m.id === model.id ? { ...m, status: "ready" as const } : m))
        );
      }, 5000);

      return model.id;
    },
    [boards]
  );

  const toggleStyleModelFavorite = useCallback((id: string) => {
    setStyleModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m))
    );
  }, []);

  const selectedHistoryItem = history.find((h) => h.id === selectedHistoryId) ?? null;

  return {
    activeSection,
    setActiveSection,
    history,
    selectedHistoryId,
    setSelectedHistoryId,
    selectedHistoryItem,
    isOnline,
    setIsOnline,
    engine,
    setEngine,
    addHistoryItem,
    // Style
    styleEngine,
    setStyleEngine,
    styleMode,
    setStyleMode,
    styleInfluence,
    setStyleInfluence,
    activeBoardId,
    setActiveBoardId,
    activeStyleModelId,
    setActiveStyleModelId,
    styleEngineOptions,
    // Boards
    boards,
    addBoard,
    deleteBoard,
    addTrackToBoard,
    removeTrackFromBoard,
    updateTrackNotes,
    // Style Models
    styleModels,
    createStyleModel,
    toggleStyleModelFavorite,
  };
}
