import type { JSX } from 'solid-js';
import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Switch,
  untrack,
} from 'solid-js';
import { difficultyColor } from './colors';
import { A } from '@solidjs/router';
import type { Beatmap } from 'osu-api-v2-js';

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
    const _active = untrack(active);
    if (_active == props.selected) return;

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
                  <Show
                    when={difficulty.mode === 'osu'}
                    fallback={
                      <ModeCircle
                        class='size-6'
                        mode={difficulty.mode}
                        style={{
                          'border-color': difficultyColor(
                            difficulty.difficultyRating
                          ),
                          color: difficultyColor(difficulty.difficultyRating),
                        }}
                      />
                    }
                  >
                    <HitCircle
                      class='size-[38px] -m-2'
                      style={{
                        color: difficultyColor(difficulty.difficultyRating),
                      }}
                    />
                  </Show>
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

export function HitCircle(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        fill='currentColor'
        d='M12 15.75a3.75 3.75 0 1 1 0-7.5a3.75 3.75 0 0 1 0 7.5'
      />
      <path
        fill='currentColor'
        d='M12 4.25a7.75 7.75 0 1 0 0 15.5a7.75 7.75 0 0 0 0-15.5M5.75 12a6.25 6.25 0 1 1 12.5 0a6.25 6.25 0 0 1-12.5 0'
      />
    </svg>
  );
}

export type ModeCircleProps = JSX.HTMLAttributes<HTMLDivElement> & {
  mode: Beatmap['mode'];
};

export function ModeCircle(props: ModeCircleProps) {
  return (
    <div
      {...props}
      class={[
        'rounded-full border-2 font-medium border-[#fff6] flex items-center justify-center',
        props.class,
      ].join(' ')}
    >
      <Switch>
        <Match when={props.mode === 'osu'}>O</Match>
        <Match when={props.mode === 'mania'}>M</Match>
        <Match when={props.mode === 'taiko'}>T</Match>
        <Match when={props.mode === 'fruits'}>F</Match>
      </Switch>
    </div>
  );
}
