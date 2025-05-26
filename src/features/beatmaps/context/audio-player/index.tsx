import { useLocation } from '@solidjs/router';
import { createContext, createEffect, ParentProps } from 'solid-js';

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
  const audioRef = (<audio />) as HTMLAudioElement;
  let active: {
    id: string;
    handler: (e: any) => void;
    onProgress: (progress: number) => void;
    onEnd: () => void;
  } | null = null;

  function unattach() {
    if (!active) return;

    audioRef.removeEventListener('timeupdate', active.handler);
    active.onProgress(0);
    active.onEnd();
    audioRef.pause();
    active = null;
  }

  createEffect(() => {
    location.pathname;

    unattach();
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

    // If any previous active callers, unattach
    if (active) unattach();

    audioRef.setAttribute('src', url);
    active = {
      id,
      handler: (e: any) => {
        if (isNaN(e.currentTarget.duration)) return;

        onProgress(e.currentTarget.currentTime / e.currentTarget.duration);
      },
      onProgress,
      onEnd,
    };

    audioRef.addEventListener('timeupdate', active.handler);

    await audioRef.play();
  }

  async function pause() {
    audioRef.pause();
  }

  return (
    <AudioPlayerContext.Provider value={{ play, pause }}>
      {props.children}
      {audioRef}
    </AudioPlayerContext.Provider>
  );
}
