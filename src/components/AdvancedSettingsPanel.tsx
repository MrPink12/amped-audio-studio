import { useState } from "react";
import { ChevronDown, ChevronRight, Settings2, Info } from "lucide-react";
import FieldLabel from "./studio/shared/FieldLabel";
import {
  StudioTextarea, StudioNumberInput, StudioTextInput,
  StudioSelect, StudioSlider,
} from "./studio/shared/StudioInput";

export interface AdvancedSettings {
  bpm: string;
  keySignature: string;
  timeSignature: string;
  audioDuration: number;
  vocalLanguage: string;
  batchSize: number;
  ditSteps: number;
  shift: number;
  customTimesteps: string;
  seed: string;
  randomSeed: boolean;
  audioFormat: string;
  inferenceMethod: string;
  lmTemperature: number;
  lmCfgScale: number;
  lmTopK: number;
  lmTopP: number;
  lmNegativePrompt: string;
}

export const DEFAULT_ADVANCED: AdvancedSettings = {
  bpm: "",
  keySignature: "",
  timeSignature: "",
  audioDuration: 30,
  vocalLanguage: "unknown",
  batchSize: 1,
  ditSteps: 8,
  shift: 3,
  customTimesteps: "",
  seed: "",
  randomSeed: true,
  audioFormat: "mp3",
  inferenceMethod: "ode",
  lmTemperature: 0.85,
  lmCfgScale: 2,
  lmTopK: 0,
  lmTopP: 0.9,
  lmNegativePrompt: "",
};

const KEYS = [
  "", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm",
];
const TIME_SIGS = ["", "2/4", "3/4", "4/4", "5/4", "6/8", "7/8"];
const VOCAL_LANGS = ["unknown", "en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh", "hi", "bn", "ar"];
const AUDIO_FMTS = ["mp3", "wav", "flac"];
const INFER_METHODS = [
  { value: "ode", label: "ODE (faster)" },
  { value: "sde", label: "SDE (different results)" },
];

const Tip = ({ text }: { text: string }) => (
  <span className="group relative ml-1 inline-flex">
    <Info className="w-3 h-3 text-muted-foreground/50 cursor-help" />
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-popover border border-border text-[9px] font-body text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
      {text}
    </span>
  </span>
);

interface Props {
  settings: AdvancedSettings;
  onChange: (s: AdvancedSettings) => void;
}

const AdvancedSettingsPanel = ({ settings, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const s = settings;
  const set = <K extends keyof AdvancedSettings>(key: K, val: AdvancedSettings[K]) =>
    onChange({ ...s, [key]: val });

  return (
    <div className="metal-panel metal-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="font-display text-xs uppercase tracking-[0.15em] text-primary">
            Advanced Settings
          </span>
        </div>
        {open
          ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-5 border-t border-border/50">
          {/* ── ROW 1: TIMING & GENERAL ── */}
          <div className="pt-4">
            <p className="text-[9px] font-display uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Timing & General
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <FieldLabel label={<>BPM <span className="text-muted-foreground/60">(optional)</span></>}>
                <StudioTextInput
                  value={s.bpm}
                  onChange={(e) => set("bpm", e.target.value)}
                  placeholder="Leave empty for n/a"
                />
              </FieldLabel>

              <FieldLabel label={<>Key Signature <span className="text-muted-foreground/60">(optional)</span></>}>
                <StudioSelect value={s.keySignature} onChange={(e) => set("keySignature", e.target.value)}>
                  <option value="">Auto / n/a</option>
                  {KEYS.filter(Boolean).map((k) => <option key={k} value={k}>{k}</option>)}
                </StudioSelect>
              </FieldLabel>

              <FieldLabel label={<>Time Signature <span className="text-muted-foreground/60">(optional)</span></>}>
                <StudioSelect value={s.timeSignature} onChange={(e) => set("timeSignature", e.target.value)}>
                  <option value="">Auto</option>
                  {TIME_SIGS.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
                </StudioSelect>
              </FieldLabel>

              <FieldLabel label={<>Audio Duration (s)<Tip text="Use -1 for auto, or 10–600 seconds" /></>}>
                <StudioNumberInput
                  value={s.audioDuration}
                  onChange={(e) => set("audioDuration", Number(e.target.value))}
                  min={-1}
                  max={600}
                />
              </FieldLabel>

              <FieldLabel label="Vocal Language">
                <StudioSelect value={s.vocalLanguage} onChange={(e) => set("vocalLanguage", e.target.value)}>
                  {VOCAL_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                </StudioSelect>
              </FieldLabel>

              <FieldLabel label={<>Batch Size<Tip text="Number of clips to generate (max 8)" /></>}>
                <StudioNumberInput
                  value={s.batchSize}
                  onChange={(e) => set("batchSize", Math.min(8, Math.max(1, Number(e.target.value))))}
                  min={1}
                  max={8}
                />
              </FieldLabel>
            </div>
          </div>

          {/* ── ROW 2: DiT & NOISE CONTROL ── */}
          <div>
            <p className="text-[9px] font-display uppercase tracking-[0.2em] text-muted-foreground mb-3">
              DiT & Noise Control
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FieldLabel label={<>DiT Inference Steps<Tip text="Turbo: max 8, Base: max 200" /></>}>
                <StudioSlider value={s.ditSteps} onChange={(v) => set("ditSteps", v)} min={1} max={20} suffix="" width="w-6" />
              </FieldLabel>

              <FieldLabel label={<>Shift<Tip text="Timestep shift factor (1.0–5.0, default 3.0). Not effective for turbo." /></>}>
                <StudioSlider value={s.shift} onChange={(v) => set("shift", v)} min={1} max={5} step={0.1} suffix="" width="w-8" />
              </FieldLabel>

              <FieldLabel label="Seed">
                <div className="space-y-2">
                  <StudioTextInput
                    value={s.seed}
                    onChange={(e) => set("seed", e.target.value)}
                    placeholder="Comma-separated for batches"
                    disabled={s.randomSeed}
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.randomSeed}
                      onChange={(e) => set("randomSeed", e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border bg-secondary accent-primary"
                    />
                    <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                      Random Seed
                    </span>
                  </label>
                </div>
              </FieldLabel>

              <div className="space-y-4">
                <FieldLabel label="Audio Format">
                  <StudioSelect value={s.audioFormat} onChange={(e) => set("audioFormat", e.target.value)}>
                    {AUDIO_FMTS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </StudioSelect>
                </FieldLabel>

                <FieldLabel label={<>Inference Method<Tip text="ODE is faster, SDE may produce different results." /></>}>
                  <StudioSelect value={s.inferenceMethod} onChange={(e) => set("inferenceMethod", e.target.value)}>
                    {INFER_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </StudioSelect>
                </FieldLabel>
              </div>
            </div>

            <div className="mt-4">
              <FieldLabel label={<>Custom Timesteps<Tip text="Override default schedule, e.g. 0.97,0.76,0.615,0.5,0.395,0.28,0.18,0.085,0" /></>}>
                <StudioTextInput
                  value={s.customTimesteps}
                  onChange={(e) => set("customTimesteps", e.target.value)}
                  placeholder="0.97,0.76,0.615,0.5,0.395,0.28,0.18,0.085,0"
                />
              </FieldLabel>
            </div>
          </div>

          {/* ── ROW 3: LM GENERATION PARAMETERS ── */}
          <div>
            <p className="text-[9px] font-display uppercase tracking-[0.2em] text-muted-foreground mb-1">
              LM Generation Parameters
            </p>
            <p className="text-[9px] font-body text-muted-foreground/60 mb-3">
              Controls for the language model that generates music tokens.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FieldLabel label={<>LM Temperature<Tip text="Higher = more random (default 0.85)" /></>}>
                <StudioSlider value={s.lmTemperature} onChange={(v) => set("lmTemperature", v)} min={0} max={2} step={0.05} suffix="" width="w-8" />
              </FieldLabel>

              <FieldLabel label={<>LM CFG Scale<Tip text="1.0 = no CFG (default 2.0)" /></>}>
                <StudioSlider value={s.lmCfgScale} onChange={(v) => set("lmCfgScale", v)} min={0} max={3} step={0.1} suffix="" width="w-8" />
              </FieldLabel>

              <FieldLabel label={<>LM Top-K<Tip text="0 = disabled" /></>}>
                <StudioSlider value={s.lmTopK} onChange={(v) => set("lmTopK", v)} min={0} max={100} suffix="" width="w-8" />
              </FieldLabel>

              <FieldLabel label={<>LM Top-P<Tip text="Nucleus sampling threshold (default 0.9)" /></>}>
                <StudioSlider value={s.lmTopP} onChange={(v) => set("lmTopP", v)} min={0} max={1} step={0.05} suffix="" width="w-8" />
              </FieldLabel>
            </div>

            <div className="mt-4">
              <FieldLabel label="LM Negative Prompt">
                <StudioTextarea
                  value={s.lmNegativePrompt}
                  onChange={(e) => set("lmNegativePrompt", e.target.value)}
                  placeholder="Optional: describe what to avoid..."
                  rows={2}
                />
              </FieldLabel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettingsPanel;
