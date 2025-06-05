import { Show } from 'solid-js';
import { useAudio } from '../../context/audio-player/use-audio';

type PlayerProps = {
  url: string;
};

export function HorizontalPlayer(props: PlayerProps) {
  const url = () => `https:${props.url}`;
  const { playing, progress, handleToggle } = useAudio(url);

  return (
    <div class='bg-[#0005] py-[5px] relative backdrop-blur-sm'>
      <div class='flex justify-center'>
        <button
          onClick={handleToggle}
          data-umami-event='horizontal-player-click'
        >
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
      <div
        class='bg-white h-[3px] w-full absolute bottom-0 origin-left duration-[600ms]'
        style={{ transform: `scaleX(${progress()})` }}
      />
    </div>
  );
}
