import { useState } from "react";
import PanelShell from "../shared/PanelShell";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextarea, StudioNumberInput, StudioSelect, StudioFileInput } from "../shared/StudioInput";

interface Props {
  engine: string;
  onGenerate: (caption: string, params: Record<string, unknown>) => void;
}

const RepaintPanel = ({ engine, onGenerate }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [keepVocals, setKeepVocals] = useState("Auto");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null); setSuccess(null);
    if (!caption.trim() || !start || !end) { setError({ title: "Validation error", message: "Caption, start and end times are required." }); return; }
    setIsLoading(true);
    onGenerate(caption, { fileName: file?.name, start, end, keepVocals });
    setTimeout(() => { setIsLoading(false); setSuccess("Repaint generated and saved."); }, 3000);
  };

  return (
    <PanelShell title="Repaint" description="Re-generate a time segment of an existing track." engine={engine} isLoading={isLoading} error={error} success={success} onGenerate={handleGenerate} generateLabel="Generate Repaint" generateDisabled={!caption.trim() || !start || !end}>
      <FieldLabel label="Source Audio to Repaint">
        <StudioFileInput onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </FieldLabel>
      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Repaint Start (s)" required>
          <StudioNumberInput value={start} onChange={(e) => setStart(e.target.value)} min={0} placeholder="0" />
        </FieldLabel>
        <FieldLabel label="Repaint End (s)" required>
          <StudioNumberInput value={end} onChange={(e) => setEnd(e.target.value)} min={0} placeholder="30" />
        </FieldLabel>
      </div>
      <FieldLabel label="Caption for Repainted Section" required>
        <StudioTextarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe what the new segment should sound like..." rows={3} />
      </FieldLabel>
      <FieldLabel label="Keep Original Vocals?">
        <StudioSelect value={keepVocals} onChange={(e) => setKeepVocals(e.target.value)}>
          <option value="Auto">Auto</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </StudioSelect>
      </FieldLabel>
    </PanelShell>
  );
};

export default RepaintPanel;
