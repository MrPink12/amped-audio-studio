import { useState } from "react";
import PanelShell from "../shared/PanelShell";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextarea, StudioNumberInput, StudioFileInput } from "../shared/StudioInput";

interface Props {
  engine: string;
  onGenerate: (caption: string, params: Record<string, unknown>) => void;
}

const CompletePanel = ({ engine, onGenerate }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [caption, setCaption] = useState("");
  const [duration, setDuration] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null); setSuccess(null);
    if (!instructions.trim()) { setError({ title: "Validation error", message: "Completion instructions are required." }); return; }
    setIsLoading(true);
    onGenerate(instructions, { fileName: file?.name, caption, duration });
    setTimeout(() => { setIsLoading(false); setSuccess("Track completed and saved."); }, 3000);
  };

  return (
    <PanelShell title="Complete" description="Complete an incomplete track by adding missing instruments or sections." engine={engine} isLoading={isLoading} error={error} success={success} onGenerate={handleGenerate} generateLabel="Complete Track" generateDisabled={!instructions.trim()}>
      <FieldLabel label="Incomplete Track (source audio)">
        <StudioFileInput onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </FieldLabel>
      <FieldLabel label="Completion Instructions" required>
        <StudioTextarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder='e.g. "Add bass and drums in the second half"' rows={3} />
      </FieldLabel>
      <FieldLabel label="Caption / Overall Style">
        <StudioTextarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe the final desired mood/genre..." rows={2} />
      </FieldLabel>
      <FieldLabel label="Target Duration (s)">
        <StudioNumberInput value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Auto" />
      </FieldLabel>
    </PanelShell>
  );
};

export default CompletePanel;
