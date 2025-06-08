import type { Beatmap } from 'osu-api-v2-js';
import { For } from 'solid-js';
import { difficultyColor } from '../../difficulties/colors';
import type { GridProps } from '../grid';
import { ModeIcon } from '../../mode-icon';

export type DifficultyBarsProps = {
  beatmapset: GridProps['beatmapsets'][0];
};

export function DifficultyBars(props: DifficultyBarsProps) {
  return (
    <div class='overflow-hidden flex gap-[2px] mt-auto items-center'>
      <For
        each={Object.entries(
          Object.groupBy(props.beatmapset.beatmaps, beatmap => beatmap.mode)
        )}
      >
        {([mode, beatmaps]) => (
          <>
            <ModeIcon
              mode={mode as Beatmap['mode']}
              class='size-[15px] fill-white'
            />
            <For each={beatmaps}>
              {beatmap => (
                <div
                  class='min-w-[6px] h-[15px] rounded-full'
                  style={{
                    'background-color': difficultyColor(
                      beatmap.difficulty_rating
                    ),
                  }}
                />
              )}
            </For>
          </>
        )}
      </For>
    </div>
  );
}
