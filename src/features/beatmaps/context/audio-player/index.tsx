import { useLocation } from '@solidjs/router';
import type { Accessor, ParentProps } from 'solid-js';
import { createContext, createEffect, createSignal } from 'solid-js';

export type AudioPlayerContext = {
  play: (id: string, url: string) => Promise<void>;
  pause: () => Promise<void>;
  playing: Accessor<boolean>;
  progress: Accessor<number>;
  activeId: Accessor<string | null>;
};

export const AudioPlayerContext = createContext<AudioPlayerContext>();

export function AudioPlayerProvider(props: ParentProps) {
  let audioRef!: HTMLAudioElement;
  const [playing, setPlaying] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  const [activeId, setActiveId] = createSignal<string | null>(null);

  function handleTimeUpdate(event: Event) {
    if (!activeId()) return;

    if (event.currentTarget instanceof HTMLAudioElement) {
      if (isNaN(event.currentTarget.duration)) return;

      setProgress(
        event.currentTarget.currentTime / event.currentTarget.duration
      );
    }
  }

  async function play(id: string, url: string) {
    audioRef.volume = 0.5;

    // If from same source and has same url, resume playback
    if (activeId() === id && audioRef.src === url) {
      audioRef.play();
      return;
    }

    // If any previous, end
    if (activeId()) handleEnded();

    audioRef.setAttribute('src', url);
    await audioRef.play();

    setActiveId(id);
  }

  async function pause() {
    audioRef.pause();
  }

  function handleEnded() {
    audioRef.pause();
    setProgress(0);
    setPlaying(false);
    setActiveId(null);
  }

  // Stop playing on navigation
  const location = useLocation();

  createEffect(() => {
    location.pathname;

    handleEnded();
  });

  return (
    <AudioPlayerContext.Provider
      value={{ play, pause, playing, progress: progress, activeId }}
    >
      {props.children}
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </AudioPlayerContext.Provider>
  );
}
