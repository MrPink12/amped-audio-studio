import { useState, useRef, useCallback, useEffect } from "react";

interface AudioPlayerState {
  activeId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  level: number; // 0–100 approximate level
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  const [state, setState] = useState<AudioPlayerState>({
    activeId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    level: 0,
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      ctxRef.current?.close();
    };
  }, []);

  const tick = useCallback(() => {
    const audio = audioRef.current;
    const analyser = analyserRef.current;
    if (!audio || audio.paused) return;

    let level = 0;
    if (analyser) {
      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      level = Math.min(100, Math.sqrt(sum / data.length) * 300);
    }

    setState((s) => ({
      ...s,
      currentTime: audio.currentTime,
      duration: audio.duration || 0,
      level,
    }));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback(
    (id: string, url: string) => {
      const audio = audioRef.current;

      // If same item, toggle pause/play
      if (state.activeId === id && audio) {
        if (audio.paused) {
          audio.play();
          setState((s) => ({ ...s, isPlaying: true }));
          rafRef.current = requestAnimationFrame(tick);
        } else {
          audio.pause();
          cancelAnimationFrame(rafRef.current);
          setState((s) => ({ ...s, isPlaying: false, level: 0 }));
        }
        return;
      }

      // Stop current
      if (audio) {
        audio.pause();
        cancelAnimationFrame(rafRef.current);
      }

      // Create new audio
      const newAudio = new Audio(url);
      newAudio.crossOrigin = "anonymous";
      audioRef.current = newAudio;

      // Set up Web Audio analyser (once per audio element)
      try {
        if (!ctxRef.current) {
          ctxRef.current = new AudioContext();
        }
        const ctx = ctxRef.current;
        // Disconnect old source
        sourceRef.current?.disconnect();
        const source = ctx.createMediaElementSource(newAudio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
        analyserRef.current = analyser;
      } catch {
        // Fallback: no analyser, meters won't work but playback still does
        analyserRef.current = null;
      }

      newAudio.addEventListener("ended", () => {
        cancelAnimationFrame(rafRef.current);
        setState((s) => ({ ...s, isPlaying: false, currentTime: 0, level: 0 }));
      });

      newAudio.addEventListener("loadedmetadata", () => {
        setState((s) => ({ ...s, duration: newAudio.duration || 0 }));
      });

      newAudio.play();
      setState({
        activeId: id,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        level: 0,
      });
      rafRef.current = requestAnimationFrame(tick);
    },
    [state.activeId, tick]
  );

  const stop = useCallback(() => {
    audioRef.current?.pause();
    cancelAnimationFrame(rafRef.current);
    setState({ activeId: null, isPlaying: false, currentTime: 0, duration: 0, level: 0 });
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  return { ...state, play, stop, seek };
}
