import LEDIndicator from "@/components/LEDIndicator";
import vunoxLogo from "@/assets/vunox_logo.png";

interface StudioHeaderProps {
  isOnline: boolean;
}

const StudioHeader = ({ isOnline }: StudioHeaderProps) => (
  <header className="border-b border-border metal-panel backdrop-blur-sm">
    <div className="px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <img src={vunoxLogo} alt="Vunox" className="w-9 h-9" />
        <div>
          <h1 className="font-display text-xl uppercase tracking-[0.15em] text-primary gold-text-glow">
            Vunox Studio
          </h1>
          <p className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground">
            Professional AI Music Production by P. Hagström
          </p>
        </div>
      </div>

      <LEDIndicator
        active={isOnline}
        color="gold"
        size="md"
        label={isOnline ? "Online" : "Offline"}
      />
    </div>
  </header>
);

export default StudioHeader;
