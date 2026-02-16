import StudioHeader from "@/components/studio/StudioHeader";
import StudioNav from "@/components/studio/StudioNav";
import HistoryPanel from "@/components/studio/HistoryPanel";
import Text2MusicPanel from "@/components/studio/panels/Text2MusicPanel";
import CoverPanel from "@/components/studio/panels/CoverPanel";
import RepaintPanel from "@/components/studio/panels/RepaintPanel";
import LegoPanel from "@/components/studio/panels/LegoPanel";
import ExtractPanel from "@/components/studio/panels/ExtractPanel";
import CompletePanel from "@/components/studio/panels/CompletePanel";
import ToolsPanel from "@/components/studio/panels/ToolsPanel";
import { useVunoxStore } from "@/hooks/useVunoxStore";
import type { SectionId } from "@/types/vunox";

const Index = () => {
  const store = useVunoxStore();

  const handleGenerate = (taskType: string) => (caption: string, params: Record<string, unknown>) => {
    store.addHistoryItem(taskType as any, caption, params);
  };

  const renderPanel = (section: SectionId) => {
    const props = { engine: store.engine, onGenerate: handleGenerate(section) };
    switch (section) {
      case "text2music": return <Text2MusicPanel {...props} />;
      case "cover": return <CoverPanel {...props} />;
      case "repaint": return <RepaintPanel {...props} />;
      case "lego": return <LegoPanel {...props} />;
      case "extract": return <ExtractPanel {...props} />;
      case "complete": return <CompletePanel {...props} />;
      case "tools": return <ToolsPanel {...props} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background metal-surface">
      <StudioHeader engine={store.engine} setEngine={store.setEngine} isOnline={store.isOnline} />

      <div className="flex flex-1 overflow-hidden">
        <StudioNav active={store.activeSection} onChange={store.setActiveSection} />

        {/* Center panel */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderPanel(store.activeSection)}
        </main>

        <HistoryPanel
          history={store.history}
          selectedId={store.selectedHistoryId}
          onSelect={store.setSelectedHistoryId}
          selectedItem={store.selectedHistoryItem}
        />
      </div>
    </div>
  );
};

export default Index;
