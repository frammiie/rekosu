import type { Beatmap, Beatmapset } from 'osu-api-v2-js';
import { Show } from 'solid-js';
import { AnchorButton } from './anchor-button';
import { NotAvailableButton } from './not-available-button';

export type ControlsProps = {
  beatmap: Beatmap;
  beatmapset: Beatmapset.Extended;
};

export function Controls(props: ControlsProps) {
  return (
    <div class='my-[20px] flex gap-[5px] items-center h-[45px]'>
      <Show
        when={!props.beatmapset.availability.download_disabled}
        fallback={
          <NotAvailableButton availability={props.beatmapset.availability} />
        }
      >
        <AnchorButton
          href={`https://osu.ppy.sh/beatmapsets/${props.beatmapset.id}/download`}
        >
          <span>Download</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
          >
            <path
              fill='currentColor'
              d='M11 5.75c-2.674 0-4.881 2-5.208 4.584l-.059.464l-.443.151A3.752 3.752 0 0 0 6.5 18.25a.75.75 0 0 1 0 1.5a5.23 5.23 0 0 1-3.3-1.167a5.25 5.25 0 0 1 1.176-8.885A6.752 6.752 0 0 1 17.52 9.25a5.25 5.25 0 0 1-.021 10.5a.75.75 0 0 1 0-1.5c.894 0 1.713-.312 2.357-.833a3.75 3.75 0 0 0-2.839-6.636l-.72.092l-.115-.717A5.25 5.25 0 0 0 11 5.75'
            />
            <path
              fill='currentColor'
              d='m12.53 21.53l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V13a.75.75 0 0 0-1.5 0v6.19l-1.22-1.22a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0'
            />
          </svg>
        </AnchorButton>
        <AnchorButton href={`osu://b/${props.beatmap.id}`} target='_self'>
          <span>osu!direct</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
          >
            <g fill='none'>
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='1.5'
                d='M13 17.5L10.5 15m2.5 2.5l2.5-2.5M13 17.5v-1.1c0-2.24 0-3.36-.436-4.216a4 4 0 0 0-1.748-1.748C9.96 10 8.84 10 6.6 10H4'
              />
              <path
                fill='currentColor'
                d='M18.82 8.5H15.5a1 1 0 0 1-1-1V4.18c.373.17.652.472.937.757l2.626 2.626c.285.285.588.564.757.937'
              />
              <path
                fill='currentColor'
                d='m15.437 4.937l-.53.53zm2.626 2.626l.53-.53zM6.25 10a.75.75 0 0 0 1.5 0zm1.5 4a.75.75 0 0 0-1.5 0zm10.955-5.717l.64-.391zm-3.988-3.988l.391-.64zM18.82 8.5v.75a.75.75 0 0 0 .683-1.06zM14.5 4.18l.31-.683a.75.75 0 0 0-1.06.683zm1.3 15.07h-5.6v1.5h5.6zm-5.6-14.5h2.975v-1.5H10.2zm8.05 5.075V16.8h1.5V9.825zm-3.343-4.357l2.625 2.625l1.061-1.06l-2.625-2.626zM7.75 10V7.2h-1.5V10zm0 6.8V14h-1.5v2.8zm9.782-8.707c.372.371.467.474.534.582l1.279-.783c-.181-.296-.431-.539-.752-.86zm-1.564-3.686c-.321-.32-.564-.57-.86-.752l-.783 1.28c.108.066.21.161.582.533zm-2.793.343c.577 0 .877.017 1.15.184l.783-1.279c-.687-.42-1.417-.405-1.934-.405zm6.575 5.075c0-.516.016-1.246-.405-1.933l-1.28.783c.168.273.185.573.185 1.15zm-.93-2.075H15.5v1.5h3.32zm-3.57-.25V4.18h-1.5V7.5zm.25.25a.25.25 0 0 1-.25-.25h-1.5c0 .966.784 1.75 1.75 1.75zm-1.31-2.888c.22.1.391.28.717.606l1.06-1.061c-.245-.246-.63-.67-1.156-.91zm3.342 3.231c.326.326.505.497.606.718l1.365-.622c-.24-.525-.664-.911-.91-1.157zM10.2 19.25c-1.129 0-1.666-.187-1.952-.463c-.28-.27-.498-.8-.498-1.987h-1.5c0 1.284.218 2.354.957 3.066c.732.707 1.795.884 2.993.884zm8.05-2.45c0 1.129-.187 1.666-.463 1.952c-.27.28-.8.498-1.987.498v1.5c1.284 0 2.354-.218 3.066-.957c.707-.732.884-1.795.884-2.993zM7.75 7.2c0-1.129.187-1.666.463-1.952c.27-.28.8-.498 1.987-.498v-1.5c-1.284 0-2.354.218-3.067.957c-.706.732-.883 1.795-.883 2.993z'
              />
            </g>
          </svg>
        </AnchorButton>
      </Show>
      <AnchorButton href={`https://osu.ppy.sh/beatmaps/${props.beatmap.id}`}>
        <span>osu!web</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            fill-rule='evenodd'
            d='M12.588 5.02a4.525 4.525 0 0 1 6.399 6.399l-.01.01l-2.264 2.264a4.525 4.525 0 0 1-6.824-.489a.75.75 0 1 1 1.201-.898a3.026 3.026 0 0 0 4.562.327l2.26-2.26a3.026 3.026 0 0 0-4.278-4.277L12.34 7.383a.75.75 0 1 1-1.058-1.064zM8.905 9.266a4.525 4.525 0 0 1 5.205 1.53a.75.75 0 0 1-1.201.898a3.024 3.024 0 0 0-4.562-.327l-2.26 2.26a3.025 3.025 0 0 0 4.277 4.278l1.286-1.286a.75.75 0 0 1 1.061 1.06l-1.3 1.3a4.525 4.525 0 0 1-6.399-6.398l.01-.01l2.264-2.264a4.5 4.5 0 0 1 1.62-1.04'
            clip-rule='evenodd'
          />
        </svg>
      </AnchorButton>
    </div>
  );
}
