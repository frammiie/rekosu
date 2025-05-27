import type { Beatmap } from 'osu-api-v2-js';
import { formatDuration } from '~/utils/formatting';
import { Stat } from './stat';

export type StatsProps = {
  beatmap: Beatmap.Extended;
};

export function Stats(props: StatsProps) {
  return (
    <div class='flex justify-evenly bg-[#0005] py-[12px] backdrop-blur-sm'>
      <Stat>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          class='size-5'
        >
          <path
            fill='currentColor'
            d='M12 4.75a7.25 7.25 0 1 0 0 14.5a7.25 7.25 0 0 0 0-14.5M3.25 12a8.75 8.75 0 1 1 17.5 0a8.75 8.75 0 0 1-17.5 0M12 7.25a.75.75 0 0 1 .75.75v3.69l1.78 1.78a.75.75 0 1 1-1.06 1.06l-2-2a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75'
          />
        </svg>
        {formatDuration(props.beatmap.total_length)}
      </Stat>
      <Stat>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='256'
          height='256'
          viewBox='0 0 256 256'
          class='size-5'
        >
          <path
            fill='currentColor'
            d='m187.14 114.84l26.78-29.46a8 8 0 0 0-11.84-10.76l-20.55 22.6l-17.2-54.07A15.94 15.94 0 0 0 149.08 32h-42.17a15.94 15.94 0 0 0-15.25 11.15l-50.91 160A16 16 0 0 0 56 224h144a16 16 0 0 0 15.25-20.85ZM184.72 160h-38.64l28.62-31.48ZM106.91 48h42.17l20 62.9l-44.62 49.1H71.27ZM56 208l10.18-32h123.63L200 208Z'
          />
        </svg>
        {props.beatmap.bpm}
      </Stat>
      <Stat>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          class='size-5 stroke-white stroke-[0.75px]'
        >
          <path
            fill='currentColor'
            d='M12 15.5a3.5 3.5 0 1 1 0-7a3.5 3.5 0 0 1 0 7M9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 0 0-5 0'
          />
          <path
            fill='currentColor'
            d='M12 4.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15M5.5 12a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0'
          />
        </svg>
        {props.beatmap.count_circles}
      </Stat>
      <Stat>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='15'
          height='15'
          viewBox='0 0 15 15'
          class='size-5'
        >
          <path
            fill='currentColor'
            fill-rule='evenodd'
            d='M10.3 7.5a1.8 1.8 0 1 1-3.6 0a1.8 1.8 0 0 1 3.6 0m.905.5a2.751 2.751 0 0 1-5.41 0H.5a.5.5 0 0 1 0-1h5.295a2.751 2.751 0 0 1 5.41 0H14.5a.5.5 0 0 1 0 1z'
            clip-rule='evenodd'
          />
        </svg>
        {props.beatmap.count_sliders}
      </Stat>
    </div>
  );
}
