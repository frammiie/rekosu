import { useLocation } from '@solidjs/router';
import type { ParentProps } from 'solid-js';
import { createContext, createEffect } from 'solid-js';

export type AudioPlayerContext = {
  play: (
    id: string,
    url: string,
    onProgress: (progress: number) => void,
    onEnd: () => void
  ) => Promise<void>;
  pause: () => Promise<void>;
};

export const AudioPlayerContext = createContext<AudioPlayerContext>();

export function AudioPlayerProvider(props: ParentProps) {
  const location = useLocation();

  let audioRef!: HTMLAudioElement;

  let active: {
    id: string;
    onProgress: (progress: number) => void;
    onEnd: () => void;
  } | null = null;

  function handleEnded() {
    if (!active) return;

    active.onProgress(0);
    active.onEnd();
    audioRef.pause();
    active = null;
  }

  function handleTimeUpdate(event: Event) {
    if (!active) return;

    if (event.currentTarget instanceof HTMLAudioElement) {
      if (isNaN(event.currentTarget.duration)) return;

      active.onProgress(
        event.currentTarget.currentTime / event.currentTarget.duration
      );
    }
  }

  createEffect(() => {
    location.pathname;

    handleEnded();
  });

  async function play(
    id: string,
    url: string,
    onProgress: (progress: number) => void,
    onEnd: () => void
  ) {
    // If from same source and has same url, resume playback
    if (active?.id === id && audioRef.src === url) {
      audioRef.play();
      return;
    }

    // If any previous, end
    if (active) handleEnded();

    audioRef.setAttribute('src', url);
    active = {
      id,
      onProgress,
      onEnd,
    };

    await audioRef.play();
  }

  async function pause() {
    audioRef.pause();
  }

  return (
    <AudioPlayerContext.Provider value={{ play, pause }}>
      {props.children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </AudioPlayerContext.Provider>
  );
}
