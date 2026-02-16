interface LEDIndicatorProps {
  active: boolean;
  color?: "white" | "gold";
  size?: "sm" | "md";
  label?: string;
}

const LEDIndicator = ({ active, color = "gold", size = "sm", label }: LEDIndicatorProps) => {
  const colorClasses = {
    white: active
      ? "bg-foreground shadow-[0_0_6px_hsl(0_0%_92%/0.8),0_0_12px_hsl(0_0%_92%/0.4)]"
      : "bg-foreground/20",
    gold: active
      ? "bg-primary shadow-[0_0_6px_hsl(43_80%_55%/0.8),0_0_12px_hsl(43_80%_55%/0.4)]"
      : "bg-primary/20",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full transition-all duration-200 ${colorClasses[color]}`}
      />
      {label && (
        <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
};

export default LEDIndicator;
