import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioPlayerState {
  activeId: string | null;
  activeLabel: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  levelL: number; // 0–100
  levelR: number; // 0–100
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserLRef = useRef<AnalyserNode | null>(null);
  const analyserRRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  const [state, setState] = useState<AudioPlayerState>({
    activeId: null,
    activeLabel: "",
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    levelL: 0,
    levelR: 0,
  });

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      ctxRef.current?.close();
    };
  }, []);

  const rmsFromAnalyser = (analyser: AnalyserNode | null): number => {
    if (!analyser) return 0;
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    return Math.min(100, Math.sqrt(sum / data.length) * 350);
  };

  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    const levelL = rmsFromAnalyser(analyserLRef.current);
    const levelR = rmsFromAnalyser(analyserRRef.current);

    setState((s) => ({
      ...s,
      currentTime: audio.currentTime,
      duration: audio.duration || 0,
      levelL,
      levelR,
    }));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback(
    (id: string, url: string, label?: string) => {
      const audio = audioRef.current;

      // Toggle if same item
      if (state.activeId === id && audio) {
        if (audio.paused) {
          audio.play();
          setState((s) => ({ ...s, isPlaying: true }));
          rafRef.current = requestAnimationFrame(tick);
        } else {
          audio.pause();
          cancelAnimationFrame(rafRef.current);
          setState((s) => ({ ...s, isPlaying: false, levelL: 0, levelR: 0 }));
        }
        return;
      }

      // Stop current
      if (audio) {
        audio.pause();
        cancelAnimationFrame(rafRef.current);
      }

      const newAudio = new Audio(url);
      newAudio.crossOrigin = "anonymous";
      audioRef.current = newAudio;

      // Set up stereo analyser
      try {
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        const ctx = ctxRef.current;
        sourceRef.current?.disconnect();
        const source = ctx.createMediaElementSource(newAudio);
        const splitter = ctx.createChannelSplitter(2);
        const merger = ctx.createChannelMerger(2);
        const analyserL = ctx.createAnalyser();
        const analyserR = ctx.createAnalyser();
        analyserL.fftSize = 256;
        analyserR.fftSize = 256;

        source.connect(splitter);
        splitter.connect(analyserL, 0);
        splitter.connect(analyserR, 1);
        // Also route to destination
        analyserL.connect(merger, 0, 0);
        analyserR.connect(merger, 0, 1);
        merger.connect(ctx.destination);

        sourceRef.current = source;
        analyserLRef.current = analyserL;
        analyserRRef.current = analyserR;
      } catch {
        analyserLRef.current = null;
        analyserRRef.current = null;
      }

      newAudio.addEventListener("ended", () => {
        cancelAnimationFrame(rafRef.current);
        setState((s) => ({ ...s, isPlaying: false, currentTime: 0, levelL: 0, levelR: 0 }));
      });

      newAudio.addEventListener("loadedmetadata", () => {
        setState((s) => ({ ...s, duration: newAudio.duration || 0 }));
      });

      newAudio.play();
      setState({
        activeId: id,
        activeLabel: label ?? "",
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        levelL: 0,
        levelR: 0,
      });
      rafRef.current = requestAnimationFrame(tick);
    },
    [state.activeId, tick]
  );

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    cancelAnimationFrame(rafRef.current);
    setState((s) => ({ ...s, isPlaying: false, currentTime: 0, levelL: 0, levelR: 0 }));
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  return { ...state, play, stop, seek };
}
