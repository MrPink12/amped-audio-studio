import { useState } from "react";
import PanelShell from "../shared/PanelShell";
import FieldLabel from "../shared/FieldLabel";
import { StudioTextarea, StudioNumberInput, StudioTextInput, StudioFileInput, StudioSlider } from "../shared/StudioInput";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  engine: string;
  onGenerate: (caption: string, params: Record<string, unknown>) => void;
}

const CoverPanel = ({ engine, onGenerate }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState("");
  const [strength, setStrength] = useState(50);
  const [duration, setDuration] = useState<string>("");
  const [bpm, setBpm] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [refTrack, setRefTrack] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    setSuccess(null);
    if (!style.trim()) { setError({ title: "Validation error", message: "Style / caption is required." }); return; }
    setIsLoading(true);
    onGenerate(style, { fileName: file?.name, strength, duration, bpm, refTrack });
    setTimeout(() => { setIsLoading(false); setSuccess("Cover generated and saved."); }, 3000);
  };

  return (
    <PanelShell title="Cover" description="Style-transform existing audio while keeping structure." engine={engine} isLoading={isLoading} error={error} success={success} onGenerate={handleGenerate} generateLabel="Generate Cover" generateDisabled={!style.trim()}>
      <FieldLabel label="Source Audio (cover from)">
        <StudioFileInput onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </FieldLabel>
      <FieldLabel label="Style / Caption" required>
        <StudioTextarea value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Describe the target style..." rows={3} />
      </FieldLabel>
      <FieldLabel label={`Cover Strength — Higher = more stylized, lower = closer to original`}>
        <StudioSlider value={strength} onChange={setStrength} />
      </FieldLabel>
      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Duration (s)">
          <StudioNumberInput value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Auto" />
        </FieldLabel>
        <FieldLabel label="BPM">
          <StudioNumberInput value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="Auto" />
        </FieldLabel>
      </div>
      <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
        {showAdvanced ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        Advanced
      </button>
      {showAdvanced && (
        <div className="pl-4 border-l border-border">
          <FieldLabel label="Reference Track">
            <StudioTextInput value={refTrack} onChange={(e) => setRefTrack(e.target.value)} placeholder="Optional reference label or path" />
          </FieldLabel>
        </div>
      )}
    </PanelShell>
  );
};

export default CoverPanel;
