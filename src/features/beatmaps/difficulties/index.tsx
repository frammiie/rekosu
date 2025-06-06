import { createEffect, createSignal, For, untrack } from 'solid-js';
import { difficultyColor } from './colors';
import { A } from '@solidjs/router';
import type { Beatmap } from 'osu-api-v2-js';
import { ModeIcon } from '../mode-icon';

type Difficulty = {
  beatmapId: number;
  version: string;
  difficultyRating: number;
  mode: Beatmap['mode'];
};

export type DifficultiesProps = {
  selected: Difficulty;
  difficulties: Difficulty[];
};

export function Difficulties(props: DifficultiesProps) {
  // eslint-disable-next-line solid/reactivity
  const [active, setActive] = createSignal<Difficulty>(props.selected);

  createEffect(() => {
    if (untrack(active) == props.selected) return;

    setActive(props.selected);
  });

  return (
    <div
      class='flex flex-col gap-[10px] group'
      style={{ 'text-shadow': 'none' }}
    >
      <ol
        class='bg-[#0006] flex w-fit items-center rounded-[10px] backdrop-blur-sm flex-wrap'
        onMouseLeave={() => setActive(props.selected)}
      >
        <For
          each={props.difficulties.sort(
            (a, b) => a.difficultyRating - b.difficultyRating
          )}
        >
          {difficulty => (
            <li>
              <A
                href={`/beatmaps/${difficulty.beatmapId}`}
                onMouseOver={() => setActive(difficulty)}
                data-umami-event='difficulty-change-click'
                data-umami-event-difficulty-rating={difficulty.difficultyRating}
              >
                <div
                  class='size-[38px] border-transparent border-2 rounded-[10px] hover:opacity-100 hover:border-white flex items-center justify-center'
                  classList={{
                    'border-white bg-[#0006]':
                      difficulty.version === props.selected.version,
                    'opacity-75': difficulty.version !== props.selected.version,
                  }}
                >
                  <ModeIcon
                    mode={difficulty.mode}
                    style={{
                      fill: difficultyColor(difficulty.difficultyRating),
                    }}
                    class='size-6'
                  />
                </div>
              </A>
            </li>
          )}
        </For>
      </ol>
      <div style={{ 'text-shadow': '0 1px 3px rgba(0,0,0,.75)' }}>
        <span class='font-semibold'>{active().version} </span>
        <span class='hidden group-hover:inline-block text-sm text-yellow-400'>
          Star rating: {active().difficultyRating}
        </span>
      </div>
    </div>
  );
}
