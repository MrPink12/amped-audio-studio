import { useState } from "react";
import PanelShell from "../shared/PanelShell";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextInput, StudioSelect, StudioFileInput } from "../shared/StudioInput";
import StyleContextBar from "../shared/StyleContextBar";
import { EXTRACT_STEMS } from "@/types/vunox";
import type { StyleMode, StyleEngineOption } from "@/types/vunox";

interface Props {
  engine: string;
  onGenerate: (caption: string, params: Record<string, unknown>) => void;
  styleEngine: string;
  styleMode: StyleMode;
  styleInfluence: number;
  styleEngineOptions: StyleEngineOption[];
}

const ExtractPanel = ({ engine, onGenerate, styleEngine, styleMode, styleInfluence, styleEngineOptions }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [stem, setStem] = useState<string>(EXTRACT_STEMS[0]);
  const [customInstruction, setCustomInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null); setSuccess(null);
    setIsLoading(true);
    onGenerate(`Extract ${stem}`, { fileName: file?.name, stem, customInstruction });
    setTimeout(() => { setIsLoading(false); setSuccess("Stem extracted and saved."); }, 3000);
  };

  return (
    <PanelShell title="Extract" description="Extract a specific stem from a full mix." engine={engine} isLoading={isLoading} error={error} success={success} onGenerate={handleGenerate} generateLabel="Extract Stem">
      <StyleContextBar styleEngine={styleEngine} styleMode={styleMode} styleInfluence={styleInfluence} styleEngineOptions={styleEngineOptions} showFileNote />
      <FieldLabel label="Full Mix (source audio)">
        <StudioFileInput onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </FieldLabel>
      <FieldLabel label="Instrument / Stem to Extract">
        <StudioSelect value={stem} onChange={(e) => setStem(e.target.value)}>
          {EXTRACT_STEMS.map((s) => <option key={s} value={s}>{s}</option>)}
        </StudioSelect>
      </FieldLabel>
      <FieldLabel label="Custom Instruction">
        <StudioTextInput value={customInstruction} onChange={(e) => setCustomInstruction(e.target.value)} placeholder='e.g. "Extract only lead synth pad"' />
      </FieldLabel>
    </PanelShell>
  );
};

export default ExtractPanel;
