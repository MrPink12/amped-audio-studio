import { useState, useEffect } from "react";
import { Music, Mic2, Radio, Headphones, Volume2, Zap, Gauge, Settings } from "lucide-react";
import Knob from "@/components/Knob";
import VUMeter from "@/components/VUMeter";
import LEDIndicator from "@/components/LEDIndicator";
import EffectPedal from "@/components/EffectPedal";
import TransportControls from "@/components/TransportControls";

const tracks = [
  { id: 1, name: "Thunderstruck Riff", bpm: 128, key: "A", duration: "3:24", status: "ready" },
  { id: 2, name: "Highway Crunch", bpm: 140, key: "E", duration: "4:12", status: "processing" },
  { id: 3, name: "Velvet Overdrive", bpm: 96, key: "D", duration: "5:01", status: "ready" },
  { id: 4, name: "Neon Valve Hum", bpm: 110, key: "G", duration: "2:58", status: "ready" },
];

const Index = () => {
  const [gain, setGain] = useState(6.5);
  const [tone, setTone] = useState(5.0);
  const [reverb, setReverb] = useState(3.2);
  const [presence, setPresence] = useState(7.0);
  const [master, setMaster] = useState(4.5);
  const [bass, setBass] = useState(6.0);
  const [mid, setMid] = useState(5.5);
  const [treble, setTreble] = useState(7.2);

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(1);

  const [overdrive, setOverdrive] = useState(true);
  const [delay, setDelay] = useState(false);
  const [chorus, setChorus] = useState(false);

  const [odGain, setOdGain] = useState(7.0);
  const [odTone, setOdTone] = useState(5.5);
  const [delayTime, setDelayTime] = useState(4.0);
  const [delayFeedback, setDelayFeedback] = useState(3.5);
  const [chorusRate, setChorusRate] = useState(3.0);
  const [chorusDepth, setChorusDepth] = useState(5.0);

  // Simulated VU meter levels
  const [vuLeft, setVuLeft] = useState(0);
  const [vuRight, setVuRight] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setVuLeft(0);
      setVuRight(0);
      return;
    }
    const interval = setInterval(() => {
      setVuLeft(45 + Math.random() * 35);
      setVuRight(42 + Math.random() * 38);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-background tolex-texture">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl uppercase tracking-[0.15em] text-primary gold-text-glow">
                AmpForge
              </h1>
              <p className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground">
                Professional Tone Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LEDIndicator active={isPlaying} color="green" size="md" label="Signal" />
            <LEDIndicator active={overdrive} color="amber" size="md" label="Drive" />
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Channel Strip / Amp Head */}
        <section className="bg-card border border-border rounded-xl p-6 tolex-texture">
          <div className="flex items-center gap-2 mb-5">
            <Gauge className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              Channel Strip
            </h2>
            <div className="flex-1 h-px bg-border ml-2" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 justify-items-center">
            <Knob label="Gain" value={gain} onChange={setGain} />
            <Knob label="Bass" value={bass} onChange={setBass} />
            <Knob label="Mid" value={mid} onChange={setMid} />
            <Knob label="Treble" value={treble} onChange={setTreble} />
            <Knob label="Tone" value={tone} onChange={setTone} />
            <Knob label="Presence" value={presence} onChange={setPresence} />
            <Knob label="Reverb" value={reverb} onChange={setReverb} />
            <Knob label="Master" value={master} onChange={setMaster} size="lg" />
          </div>
        </section>

        {/* Middle row: Effects + Meters + Transport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Effects Rack */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-4 h-4 text-primary" />
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
                Effects Rack
              </h2>
              <div className="flex-1 h-px bg-border ml-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <EffectPedal name="Overdrive" active={overdrive} onToggle={() => setOverdrive(!overdrive)}>
                <Knob label="Gain" value={odGain} onChange={setOdGain} size="sm" />
                <Knob label="Tone" value={odTone} onChange={setOdTone} size="sm" />
              </EffectPedal>

              <EffectPedal name="Delay" active={delay} onToggle={() => setDelay(!delay)}>
                <Knob label="Time" value={delayTime} onChange={setDelayTime} size="sm" />
                <Knob label="Feedback" value={delayFeedback} onChange={setDelayFeedback} size="sm" />
              </EffectPedal>

              <EffectPedal name="Chorus" active={chorus} onToggle={() => setChorus(!chorus)}>
                <Knob label="Rate" value={chorusRate} onChange={setChorusRate} size="sm" />
                <Knob label="Depth" value={chorusDepth} onChange={setChorusDepth} size="sm" />
              </EffectPedal>
            </div>
          </div>

          {/* Output Meters */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-4 h-4 text-primary" />
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
                Output
              </h2>
              <div className="flex-1 h-px bg-border ml-2" />
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <VUMeter level={vuLeft} label="L" peak />
                <VUMeter level={vuRight} label="R" peak />
              </div>

              {/* Transport */}
              <div className="flex justify-center pt-2">
                <TransportControls
                  isPlaying={isPlaying}
                  onPlay={() => setIsPlaying(!isPlaying)}
                  onStop={() => setIsPlaying(false)}
                  onPrev={() => setSelectedTrack(Math.max(1, selectedTrack - 1))}
                  onNext={() => setSelectedTrack(Math.min(tracks.length, selectedTrack + 1))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Track List */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              Sessions
            </h2>
            <div className="flex-1 h-px bg-border ml-2" />
            <button className="text-[10px] font-display uppercase tracking-widest text-primary border border-primary/30 px-3 py-1 rounded hover:bg-primary/10 transition-colors">
              + New Session
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-2 border-b border-border text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground">
              <span className="w-8">#</span>
              <span>Track</span>
              <span className="text-center">BPM</span>
              <span className="text-center">Key</span>
              <span className="text-center">Duration</span>
              <span className="text-center">Status</span>
            </div>

            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`w-full grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center
                  transition-all duration-200 text-left border-b border-border/30 last:border-b-0
                  ${
                    selectedTrack === track.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-secondary/30"
                  }`}
              >
                <span className="w-8 font-mono text-xs text-muted-foreground">
                  {selectedTrack === track.id && isPlaying ? (
                    <span className="text-primary animate-pulse-glow">▶</span>
                  ) : (
                    String(track.id).padStart(2, "0")
                  )}
                </span>
                <span className={`font-body text-sm ${selectedTrack === track.id ? "text-primary" : "text-foreground"}`}>
                  {track.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground text-center">{track.bpm}</span>
                <span className="font-mono text-xs text-muted-foreground text-center">{track.key}</span>
                <span className="font-mono text-xs text-muted-foreground text-center">{track.duration}</span>
                <span className="text-center">
                  <LEDIndicator
                    active={track.status === "ready"}
                    color={track.status === "ready" ? "green" : "amber"}
                  />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-4 border-t border-border/30">
          <p className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground">
            AmpForge™ Professional Tone Studio — All Tubes. All Analog. All Rock.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
