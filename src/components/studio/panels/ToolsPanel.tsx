import { useState } from "react";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextarea, StudioSelect, StudioFileInput, StudioTextInput } from "../shared/StudioInput";
import StyleContextBar from "../shared/StyleContextBar";
import { VOCAL_LANGUAGES } from "@/types/vunox";
import type { StyleMode, StyleEngineOption } from "@/types/vunox";
import { Loader2, Sparkles, FileText, Ear } from "lucide-react";
import type { ToolResult } from "@/types/vunox";

interface Props {
  engine: string;
  onGenerate: (caption: string, params: Record<string, unknown>) => void;
  styleEngine: string;
  styleMode: StyleMode;
  styleInfluence: number;
  styleEngineOptions: StyleEngineOption[];
}

const ToolCard = ({
  icon: Icon,
  title,
  description,
  children,
  onRun,
  runLabel,
  isLoading,
  result,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  onRun: () => void;
  runLabel: string;
  isLoading: boolean;
  result: ToolResult | null;
}) => (
  <div className="metal-panel metal-border rounded-lg p-5 space-y-4">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="font-display text-sm uppercase tracking-[0.15em] text-primary">{title}</h3>
    </div>
    <p className="text-[10px] font-body text-muted-foreground">{description}</p>
    {children}
    <button
      onClick={onRun}
      disabled={isLoading}
      className="px-4 py-2 bg-primary text-primary-foreground rounded font-display text-[11px] uppercase tracking-widest hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
    >
      {isLoading ? <><Loader2 className="w-3 h-3 animate-spin" />Processing…</> : runLabel}
    </button>
    {result && (
      <div className="p-3 rounded bg-secondary/50 border border-border space-y-1">
        {result.caption && <p className="text-[10px] font-body text-foreground"><span className="text-muted-foreground">Caption:</span> {result.caption}</p>}
        {result.lyrics && <p className="text-[10px] font-body text-foreground"><span className="text-muted-foreground">Lyrics:</span> {result.lyrics}</p>}
        {result.bpm && <p className="text-[10px] font-mono text-foreground"><span className="text-muted-foreground">BPM:</span> {result.bpm}</p>}
        {result.duration && <p className="text-[10px] font-mono text-foreground"><span className="text-muted-foreground">Duration:</span> {result.duration}s</p>}
        {result.key && <p className="text-[10px] font-mono text-foreground"><span className="text-muted-foreground">Key:</span> {result.key}</p>}
        {result.timeSignature && <p className="text-[10px] font-mono text-foreground"><span className="text-muted-foreground">Time Sig:</span> {result.timeSignature}</p>}
        {result.language && <p className="text-[10px] font-mono text-foreground"><span className="text-muted-foreground">Language:</span> {result.language}</p>}
      </div>
    )}
  </div>
);

const ToolsPanel = ({ engine, onGenerate, styleEngine, styleMode, styleInfluence, styleEngineOptions }: Props) => {
  // Create Sample
  const [csIdea, setCsIdea] = useState("");
  const [csInstrumental, setCsInstrumental] = useState(false);
  const [csLang, setCsLang] = useState("Auto");
  const [csLoading, setCsLoading] = useState(false);
  const [csResult, setCsResult] = useState<ToolResult | null>(null);

  // Format Sample
  const [fsCaption, setFsCaption] = useState("");
  const [fsLyrics, setFsLyrics] = useState("");
  const [fsLoading, setFsLoading] = useState(false);
  const [fsResult, setFsResult] = useState<ToolResult | null>(null);

  // Understand
  const [uFile, setUFile] = useState<File | null>(null);
  const [uNotes, setUNotes] = useState("");
  const [uLoading, setULoading] = useState(false);
  const [uResult, setUResult] = useState<ToolResult | null>(null);

  const mockResult = (): ToolResult => ({
    caption: "Soft acoustic ballad with fingerpicking guitar",
    lyrics: "[Verse 1]\nGentle morning light...",
    bpm: 92,
    duration: 45,
    key: "Am",
    timeSignature: "4/4",
    language: "English",
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg uppercase tracking-[0.15em] text-primary gold-text-glow mb-1">Tools</h2>
        <p className="text-[11px] font-body text-muted-foreground">Utility tools for sample creation, formatting, and audio analysis.</p>
      </div>

      <StyleContextBar styleEngine={styleEngine} styleMode={styleMode} styleInfluence={styleInfluence} styleEngineOptions={styleEngineOptions} />

      <div className="grid grid-cols-1 gap-5">
        {/* Create Sample */}
        <ToolCard icon={Sparkles} title="Create Sample" description="Generate a structured sample specification from a natural language idea." onRun={() => { setCsLoading(true); onGenerate(csIdea, { tool: "create-sample", instrumental: csInstrumental, language: csLang }); setTimeout(() => { setCsLoading(false); setCsResult(mockResult()); }, 2000); }} runLabel="Create Sample" isLoading={csLoading} result={csResult}>
          <FieldLabel label="Idea / Description" required>
            <StudioTextarea value={csIdea} onChange={(e) => setCsIdea(e.target.value)} placeholder='e.g. "A soft Bengali love song for a quiet evening"' rows={2} />
          </FieldLabel>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={csInstrumental} onChange={(e) => setCsInstrumental(e.target.checked)} className="w-3.5 h-3.5 rounded border-border bg-secondary accent-primary" />
            <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Instrumental only</span>
          </label>
          <FieldLabel label="Vocal Language">
            <StudioSelect value={csLang} onChange={(e) => setCsLang(e.target.value)}>
              {VOCAL_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </StudioSelect>
          </FieldLabel>
        </ToolCard>

        {/* Format Sample */}
        <ToolCard icon={FileText} title="Format Sample" description="Format rough caption and lyrics into production-ready metadata." onRun={() => { setFsLoading(true); onGenerate(fsCaption, { tool: "format-sample", lyrics: fsLyrics }); setTimeout(() => { setFsLoading(false); setFsResult(mockResult()); }, 2000); }} runLabel="Format Sample" isLoading={fsLoading} result={fsResult}>
          <FieldLabel label="Caption (rough)" required>
            <StudioTextarea value={fsCaption} onChange={(e) => setFsCaption(e.target.value)} placeholder="Your rough caption..." rows={2} />
          </FieldLabel>
          <FieldLabel label="Lyrics (rough)">
            <StudioTextarea value={fsLyrics} onChange={(e) => setFsLyrics(e.target.value)} placeholder="Optional rough lyrics..." rows={2} />
          </FieldLabel>
        </ToolCard>

        {/* Understand */}
        <ToolCard icon={Ear} title="Understand" description="Analyze existing audio and return caption, lyrics, BPM, key, and more." onRun={() => { setULoading(true); onGenerate("Analyze audio", { tool: "understand", fileName: uFile?.name, notes: uNotes }); setTimeout(() => { setULoading(false); setUResult(mockResult()); }, 2000); }} runLabel="Analyze" isLoading={uLoading} result={uResult}>
          <FieldLabel label="Audio to Analyze">
            <StudioFileInput onChange={(e) => setUFile(e.target.files?.[0] ?? null)} />
          </FieldLabel>
          <FieldLabel label="Additional Notes">
            <StudioTextarea value={uNotes} onChange={(e) => setUNotes(e.target.value)} placeholder='e.g. "Focus on vocals and key only"' rows={2} />
          </FieldLabel>
        </ToolCard>
      </div>
    </div>
  );
};

export default ToolsPanel;
