import { createSignal, For, Show } from 'solid-js';
import { difficultyColor } from './colors';
import { A } from '@solidjs/router';
import { ModeIcon } from '../mode-icon';
import type { RekosuBeatmap, RekosuBeatmapset } from '~/server/data';

export type DifficultiesProps = {
  beatmapset: RekosuBeatmapset;
  selected: RekosuBeatmap;
};

export function Difficulties(props: DifficultiesProps) {
  const difficulties = () => props.beatmapset.beatmaps;

  const [active, setActive] =
    // eslint-disable-next-line solid/reactivity
    createSignal<RekosuBeatmap>(props.selected);

  return (
    <div
      class='flex flex-col gap-[10px] group'
      style={{ 'text-shadow': 'none' }}
      onMouseLeave={() => setActive(props.selected)}
    >
      <ol class='bg-[#0006] flex w-fit items-center rounded-[10px] backdrop-blur-sm flex-wrap'>
        <For
          each={difficulties().sort(
            (a, b) => a.difficulty_rating - b.difficulty_rating
          )}
        >
          {difficulty => (
            <li>
              <A
                href={`/beatmaps/${difficulty.id}`}
                onMouseOver={() => setActive(difficulty)}
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
                      fill: difficultyColor(difficulty.difficulty_rating),
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
        <div>
          <span class='font-semibold'>{active().version} </span>
          <span class='hidden group-hover:inline-block text-sm text-yellow-400'>
            Star rating: {active().difficulty_rating}
          </span>
        </div>
        <div class='text-sm'>
          <span class='font-semibold'>
            {active().maxPp != null ? active().maxPp?.toFixed(0) : '? '}pp
          </span>
          <Show when={active().owners[0].id !== props.beatmapset.user.id}>
            <span class='text-xs'>
              {' | mapped by '}
              <For each={active().owners}>
                {(owner, index) => (
                  <>
                    <A
                      href={`https://osu.ppy.sh/users/${owner.id}`}
                      class='font-semibold'
                      target='_blank'
                    >
                      {owner.username}
                    </A>{' '}
                    <Show when={index() != active().owners.length - 1}>
                      and{' '}
                    </Show>
                  </>
                )}
              </For>
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
}
