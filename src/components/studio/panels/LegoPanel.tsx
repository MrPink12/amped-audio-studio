import { useState } from "react";
import PanelShell from "../shared/PanelShell";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextarea, StudioNumberInput, StudioSelect, StudioFileInput } from "../shared/StudioInput";
import StyleContextBar from "../shared/StyleContextBar";
import { INSTRUMENTS } from "@/types/vunox";
import type { StyleMode, StyleEngineOption } from "@/types/vunox";

interface Props {
  engine: string;
  onGenerate: (caption: string, params: Record<string, unknown>) => void;
  styleEngine: string;
  styleMode: StyleMode;
  styleInfluence: number;
  styleEngineOptions: StyleEngineOption[];
}

const LegoPanel = ({ engine, onGenerate, styleEngine, styleMode, styleInfluence, styleEngineOptions }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [instrument, setInstrument] = useState<string>(INSTRUMENTS[0]);
  const [caption, setCaption] = useState("");
  const [duration, setDuration] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null); setSuccess(null);
    if (!caption.trim()) { setError({ title: "Validation error", message: "Caption is required." }); return; }
    setIsLoading(true);
    onGenerate(caption, { fileName: file?.name, instrument, duration });
    setTimeout(() => { setIsLoading(false); setSuccess("Lego track generated and saved."); }, 3000);
  };

  return (
    <PanelShell title="Lego" description="Generate a specific instrument track in the context of a backing track." engine={engine} isLoading={isLoading} error={error} success={success} onGenerate={handleGenerate} generateLabel="Generate Lego Track" generateDisabled={!caption.trim()}>
      <StyleContextBar styleEngine={styleEngine} styleMode={styleMode} styleInfluence={styleInfluence} styleEngineOptions={styleEngineOptions} showFileNote />
      <FieldLabel label="Backing Track (source audio)">
        <StudioFileInput onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </FieldLabel>
      <FieldLabel label="Instrument / Track Type">
        <StudioSelect value={instrument} onChange={(e) => setInstrument(e.target.value)}>
          {INSTRUMENTS.map((i) => <option key={i} value={i}>{i}</option>)}
        </StudioSelect>
      </FieldLabel>
      <FieldLabel label="Caption / Style" required>
        <StudioTextarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe the style for this instrument..." rows={3} />
      </FieldLabel>
      <FieldLabel label="Duration (s)">
        <StudioNumberInput value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Auto" />
      </FieldLabel>
    </PanelShell>
  );
};

export default LegoPanel;
