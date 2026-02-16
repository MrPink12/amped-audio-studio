interface LEDIndicatorProps {
  active: boolean;
  color?: "green" | "red" | "amber";
  size?: "sm" | "md";
  label?: string;
}

const LEDIndicator = ({ active, color = "green", size = "sm", label }: LEDIndicatorProps) => {
  const colorClasses = {
    green: active ? "bg-led-green led-glow-green" : "bg-led-green/20",
    red: active ? "bg-destructive led-glow-red" : "bg-destructive/20",
    amber: active ? "bg-primary led-glow-amber" : "bg-primary/20",
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
        <span className="text-[10px] font-display uppercase tracking-wider text-cream/50">
          {label}
        </span>
      )}
    </div>
  );
};

export default LEDIndicator;
