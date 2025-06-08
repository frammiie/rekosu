import type { Accessor } from 'solid-js';
import { createMemo, createUniqueId, useContext } from 'solid-js';
import { AudioPlayerContext } from '.';

export function useAudio(url: Accessor<string>, id?: Accessor<string>) {
  const audioPlayer = useContext(AudioPlayerContext)!;
  if (!audioPlayer) {
    throw new Error("Can't find AudioPlayerContext");
  }
  const effectiveId = createMemo(() => id?.() ?? createUniqueId());

  const playingId = createMemo(
    () => audioPlayer.playing() && audioPlayer.activeId() === effectiveId()
  );

  const playingProgress = createMemo(() => {
    if (audioPlayer.activeId() !== effectiveId()) return 0;

    return audioPlayer.progress();
  });

  async function handleToggle() {
    if (!playingId()) {
      await audioPlayer.play(effectiveId(), url());
    } else {
      await audioPlayer.pause();
    }
  }

  return {
    playing: playingId,
    progress: playingProgress,
    handleToggle,
  };
}
