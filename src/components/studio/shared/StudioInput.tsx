import React from "react";
import { cn } from "@/lib/utils";

const baseClass =
  "w-full bg-background border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200";

export const StudioTextarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cn(baseClass, "min-h-[72px] resize-y", className)} {...props} />
);

export const StudioNumberInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="number"
    className={cn(baseClass, "max-w-[140px] tabular-nums font-mono", className)}
    {...props}
  />
);

export const StudioTextInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input type="text" className={cn(baseClass, className)} {...props} />
);

export const StudioSelect = ({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      baseClass,
      "appearance-none cursor-pointer bg-secondary max-w-[200px]",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

export const StudioFileInput = ({
  className,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name ?? null);
    onChange?.(e);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleChange}
        {...props}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="shrink-0 py-1.5 px-3 rounded border border-border bg-secondary text-foreground
          font-display text-[10px] uppercase tracking-widest cursor-pointer hover:bg-secondary/80 transition-all"
      >
        Choose File
      </button>
      <span className="text-sm font-body text-muted-foreground truncate">
        {fileName ?? "No file chosen"}
      </span>
    </div>
  );
};

export const StudioSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) => (
  <div className="flex items-center gap-3">
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="flex-1 h-1.5 bg-border rounded-full appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
    />
    <span className="text-[11px] font-mono text-primary tabular-nums w-10 text-right">
      {value}%
    </span>
  </div>
);
