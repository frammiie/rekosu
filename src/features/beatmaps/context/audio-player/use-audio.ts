import type { Accessor} from 'solid-js';
import { createSignal, createUniqueId, useContext } from 'solid-js';
import { AudioPlayerContext } from '.';

export function useAudio(url: Accessor<string>) {
  const [playing, setPlaying] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  const id = createUniqueId();

  const audioPlayer = useContext(AudioPlayerContext)!;
  if (!audioPlayer) {
    throw new Error("Can't find AudioPlayerContext");
  }

  async function handleToggle() {
    if (!playing()) {
      await audioPlayer.play(id, url(), setProgress, () => setPlaying(false));
      setPlaying(true);
    } else {
      await audioPlayer.pause();
      setPlaying(false);
    }
  }

  return {
    playing,
    progress,
    handleToggle,
  };
}
