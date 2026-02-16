import { ReactNode, useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PanelShellProps {
  title: string;
  description: string;
  engine: string;
  isLoading?: boolean;
  error?: { title: string; message: string; details?: string } | null;
  success?: string | null;
  onGenerate: () => void;
  generateLabel: string;
  generateDisabled?: boolean;
  children: ReactNode;
}

const PanelShell = ({
  title,
  description,
  engine,
  isLoading,
  error,
  success,
  onGenerate,
  generateLabel,
  generateDisabled,
  children,
}: PanelShellProps) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95;
          const increment = Math.random() * 8 + 2;
          return Math.min(prev + increment, 95);
        });
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progress > 0) {
        setProgress(100);
        const t = setTimeout(() => setProgress(0), 600);
        return () => clearTimeout(t);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLoading]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-display text-lg uppercase tracking-[0.15em] text-primary gold-text-glow">
            {title}
          </h2>
          <span className="text-[9px] font-mono text-muted-foreground bg-secondary/50 border border-border rounded px-2 py-0.5">
            {engine}
          </span>
        </div>
        <p className="text-[11px] font-body text-muted-foreground">{description}</p>
      </div>

      {/* Fields */}
      <div className="space-y-4">{children}</div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded bg-destructive/10 border border-destructive/30 space-y-1">
          <p className="text-[11px] font-display text-destructive">{error.title}</p>
          <p className="text-[10px] font-body text-destructive/80">{error.message}</p>
          {error.details && <p className="text-[9px] font-mono text-destructive/60">{error.details}</p>}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-3 rounded bg-primary/10 border border-primary/30">
          <p className="text-[11px] font-body text-primary">{success}</p>
        </div>
      )}

      {/* Progress bar */}
      {(isLoading || progress > 0) && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground">
              {progress >= 100 ? "Complete" : "Generating…"}
            </span>
            <span className="text-[10px] font-mono text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-secondary/60 [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-200" />
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || generateDisabled}
        className="px-6 py-2.5 bg-primary text-primary-foreground rounded font-display text-sm
          uppercase tracking-widest hover:bg-primary/90 transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed gold-glow flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating…
          </>
        ) : (
          generateLabel
        )}
      </button>
    </div>
  );
};

export default PanelShell;
