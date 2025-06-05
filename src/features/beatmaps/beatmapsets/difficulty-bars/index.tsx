import type { Beatmap } from 'osu-api-v2-js';
import { For, Show } from 'solid-js';
import { ModeCircle, HitCircle } from '../../difficulties';
import { difficultyColor } from '../../difficulties/colors';
import type { GridProps } from '../grid';

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
            <Show
              when={mode === 'osu'}
              fallback={
                <ModeCircle
                  mode={mode as Beatmap['mode']}
                  class='size-[14px] text-[0.6rem] flex-shrink-0'
                />
              }
            >
              <HitCircle class='size-5 -m-0.5 flex-shrink-0' />
            </Show>
            <For each={beatmaps}>
              {beatmap => (
                <div
                  class='min-w-[6px] h-[12px] rounded-full'
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
