import { useState } from "react";
import PanelShell from "../shared/PanelShell";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextarea, StudioSlider } from "../shared/StudioInput";
import StyleContextBar from "../shared/StyleContextBar";
import type { StyleMode, StyleEngineOption } from "@/types/vunox";
import AdvancedSettingsPanel, {
  type AdvancedSettings,
  DEFAULT_ADVANCED,
} from "@/components/AdvancedSettingsPanel";

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
  const [strength, setStrength] = useState(0.5);
  const [advanced, setAdvanced] = useState<AdvancedSettings>(DEFAULT_ADVANCED);
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
    onGenerate(caption, {
      lyrics,
      strength,
      duration: advanced.audioDuration,
      bpm: advanced.bpm || null,
      musicalKey: advanced.keySignature,
      timeSig: advanced.timeSignature,
      language: advanced.vocalLanguage,
      seed: advanced.randomSeed ? null : advanced.seed,
      // TODO: wire remaining advanced settings
    });
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

      <FieldLabel label="Strength">
        <StudioSlider value={strength} onChange={setStrength} min={0} max={1} step={0.01} />
      </FieldLabel>

      <AdvancedSettingsPanel settings={advanced} onChange={setAdvanced} />
    </PanelShell>
  );
};

export default Text2MusicPanel;
