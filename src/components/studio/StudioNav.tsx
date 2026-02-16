import { Music, Layers, Paintbrush, Puzzle, Scissors, PlusCircle, Wrench } from "lucide-react";
import type { SectionId } from "@/types/vunox";
import { SECTIONS } from "@/types/vunox";

const ICONS: Record<SectionId, React.ElementType> = {
  text2music: Music,
  cover: Layers,
  repaint: Paintbrush,
  lego: Puzzle,
  extract: Scissors,
  complete: PlusCircle,
  tools: Wrench,
};

interface StudioNavProps {
  active: SectionId;
  onChange: (id: SectionId) => void;
}

const StudioNav = ({ active, onChange }: StudioNavProps) => (
  <nav className="w-48 shrink-0 metal-panel border-r border-border flex flex-col py-2">
    <div className="px-3 py-2 mb-1">
      <span className="text-[9px] font-display uppercase tracking-[0.25em] text-muted-foreground">
        Tasks
      </span>
    </div>
    {SECTIONS.map((section) => {
      const Icon = ICONS[section.id];
      const isActive = active === section.id;
      const isTools = section.id === "tools";
      return (
        <div key={section.id}>
          {isTools && <div className="h-px bg-border mx-3 my-2" />}
          <button
            onClick={() => onChange(section.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-150
              ${isActive
                ? "bg-primary/10 border-l-2 border-l-primary text-primary"
                : "border-l-2 border-l-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-display uppercase tracking-[0.15em]">
              {section.label}
            </span>
          </button>
        </div>
      );
    })}
  </nav>
);

export default StudioNav;
