import { useState, useCallback } from "react";
import type { SectionId, HistoryItem, TaskType, ToolType } from "@/types/vunox";

export function useVunoxStore() {
  const [activeSection, setActiveSection] = useState<SectionId>("text2music");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [engine, setEngine] = useState("ace-step-v1.5");

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
        params,
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
    [engine]
  );

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
  };
}
