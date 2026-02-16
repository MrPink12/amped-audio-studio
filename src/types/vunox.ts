// Vunox Studio types

export type TaskType = "text2music" | "cover" | "repaint" | "lego" | "extract" | "complete";
export type ToolType = "create-sample" | "format-sample" | "understand";
export type SectionId = TaskType | "tools";

export interface HistoryItem {
  id: string;
  timestamp: Date;
  taskType: TaskType | ToolType;
  engine: string;
  caption: string;
  fileName?: string;
  status: "pending" | "running" | "success" | "error";
  error?: { title: string; message: string; details?: string };
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
}

export interface ToolResult {
  caption?: string;
  lyrics?: string;
  bpm?: number;
  duration?: number;
  key?: string;
  timeSignature?: string;
  language?: string;
}

export const ENGINES = [
  { value: "ace-step-v1.5", label: "ACE-Step v1.5" },
] as const;

export const MUSICAL_KEYS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm",
] as const;

export const TIME_SIGNATURES = ["4/4", "3/4", "6/8", "2/4", "5/4", "7/8"] as const;

export const VOCAL_LANGUAGES = [
  "Auto", "English", "Spanish", "French", "German", "Italian",
  "Portuguese", "Japanese", "Korean", "Chinese", "Hindi", "Bengali", "Arabic",
] as const;

export const INSTRUMENTS = [
  "Vocals", "Backing Vocals", "Drums", "Bass", "Guitar",
  "Keys / Piano", "Synth", "Strings", "FX",
] as const;

export const EXTRACT_STEMS = [
  "Vocals", "Drums", "Bass", "Guitar", "Keys", "Other/Custom",
] as const;

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "text2music", label: "Text2Music" },
  { id: "cover", label: "Cover" },
  { id: "repaint", label: "Repaint" },
  { id: "lego", label: "Lego" },
  { id: "extract", label: "Extract" },
  { id: "complete", label: "Complete" },
  { id: "tools", label: "Tools" },
];
