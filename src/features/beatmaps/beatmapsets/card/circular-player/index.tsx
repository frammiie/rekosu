import { createEffect, createSignal, Show } from 'solid-js';
import { useAudio } from '~/features/beatmaps/context/audio-player/use-audio';

export type CircularPlayerProps = {
  url: string;
};

export function CircularPlayer(props: CircularPlayerProps) {
  const { playing, progress, handleToggle } = useAudio(`https:${props.url}`);
  const radius = 11;

  return (
    <div class='size-full bg-[#0005] rounded-[10px] items-center justify-center hidden group-hover:flex'>
      <div class='size-[50px] relative -ml-[10px] flex items-center justify-center'>
        <svg width='50' height='50' viewBox='0 0 25 25' class='size-[50px]'>
          <circle
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
            stroke-width='3'
            stroke-dashoffset={(1 - progress()) * (2 * Math.PI * radius)}
            stroke-dasharray={String(2 * Math.PI * radius)}
            style='transform:rotate(-90deg);transform-origin: 50% 50%;'
            class='stroke-[#fffc] duration-[600ms]'
          />
        </svg>
        <button onClick={handleToggle} class='absolute'>
          <Show
            when={!playing()}
            fallback={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                class='size-7'
              >
                <path
                  fill='currentColor'
                  d='M8.75 5.5A1.75 1.75 0 0 0 7 7.25v9.5a1.75 1.75 0 1 0 3.5 0v-9.5A1.75 1.75 0 0 0 8.75 5.5m6.5 0a1.75 1.75 0 0 0-1.75 1.75v9.5a1.75 1.75 0 1 0 3.5 0v-9.5a1.75 1.75 0 0 0-1.75-1.75'
                />
              </svg>
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              class='size-7'
            >
              <path
                fill='currentColor'
                d='M10.01 5.887c-1.667-.972-3.76.23-3.76 2.16v7.906c0 1.93 2.093 3.132 3.76 2.16l6.777-3.954c1.653-.964 1.653-3.354 0-4.318z'
              />
            </svg>
          </Show>
        </button>
      </div>
    </div>
  );
}
