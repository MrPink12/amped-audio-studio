import { useState } from "react";
import PanelShell from "../shared/PanelShell";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextarea, StudioNumberInput, StudioSelect } from "../shared/StudioInput";
import StyleContextBar from "../shared/StyleContextBar";
import { MUSICAL_KEYS, TIME_SIGNATURES, VOCAL_LANGUAGES } from "@/types/vunox";
import type { StyleMode, StyleEngineOption } from "@/types/vunox";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  engine: string;
  onGenerate: (caption: string, params: Record<string, unknown>) => void;
  styleEngine: string;
  styleMode: StyleMode;
  styleInfluence: number;
  styleEngineOptions: StyleEngineOption[];
}

const Text2MusicPanel = ({ engine, onGenerate, styleEngine, styleMode, styleInfluence, styleEngineOptions }: Props) => {
  const [caption, setCaption] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [duration, setDuration] = useState(30);
  const [bpm, setBpm] = useState<string>("");
  const [musicalKey, setMusicalKey] = useState("");
  const [timeSig, setTimeSig] = useState("");
  const [language, setLanguage] = useState("Auto");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seed, setSeed] = useState<string>("");
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    setSuccess(null);
    if (!caption.trim()) {
      setError({ title: "Validation error", message: "Caption / prompt is required." });
      return;
    }
    setIsLoading(true);
    onGenerate(caption, { lyrics, duration, bpm: bpm || null, musicalKey, timeSig, language, seed: useRandomSeed ? null : seed });
    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Clip generated and saved.");
    }, 3000);
  };

  return (
    <PanelShell
      title="Text2Music"
      description="Generate music from a text caption and optional lyrics."
      engine={engine}
      isLoading={isLoading}
      error={error}
      success={success}
      onGenerate={handleGenerate}
      generateLabel="Generate Text2Music"
      generateDisabled={!caption.trim()}
    >
      <StyleContextBar styleEngine={styleEngine} styleMode={styleMode} styleInfluence={styleInfluence} styleEngineOptions={styleEngineOptions} />
      <FieldLabel label="Caption / Prompt" required>
        <StudioTextarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Heavy blues riff in E, 120 BPM, analog distortion..."
          rows={3}
        />
      </FieldLabel>

      <FieldLabel label="Lyrics">
        <StudioTextarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Optional lyrics..."
          rows={3}
        />
      </FieldLabel>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FieldLabel label="Duration (s)" required>
          <StudioNumberInput value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} max={600} />
        </FieldLabel>
        <FieldLabel label="BPM">
          <StudioNumberInput value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="Auto" min={20} max={300} />
        </FieldLabel>
        <FieldLabel label="Key">
          <StudioSelect value={musicalKey} onChange={(e) => setMusicalKey(e.target.value)}>
            <option value="">Auto</option>
            {MUSICAL_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
          </StudioSelect>
        </FieldLabel>
        <FieldLabel label="Time Signature">
          <StudioSelect value={timeSig} onChange={(e) => setTimeSig(e.target.value)}>
            <option value="">Auto</option>
            {TIME_SIGNATURES.map((t) => <option key={t} value={t}>{t}</option>)}
          </StudioSelect>
        </FieldLabel>
      </div>

      <FieldLabel label="Vocal Language">
        <StudioSelect value={language} onChange={(e) => setLanguage(e.target.value)}>
          {VOCAL_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </StudioSelect>
      </FieldLabel>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        Advanced
      </button>
      {showAdvanced && (
        <div className="pl-4 border-l border-border space-y-3">
          <FieldLabel label="Seed">
            <StudioNumberInput
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Optional"
              disabled={useRandomSeed}
            />
          </FieldLabel>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useRandomSeed}
              onChange={(e) => setUseRandomSeed(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border bg-secondary accent-primary"
            />
            <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
              Use random seed
            </span>
          </label>
        </div>
      )}
    </PanelShell>
  );
};

export default Text2MusicPanel;
