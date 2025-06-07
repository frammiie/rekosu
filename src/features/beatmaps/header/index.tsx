import { Show } from 'solid-js';
import { Difficulties } from '../difficulties';
import { HorizontalPlayer } from './horizontal-player';
import { Throbber } from '~/features/ui/throbber';
import { Error } from '~/features/ui/error';
import { Portal } from 'solid-js/web';
import { NavSuspense } from '~/features/ui/nav-suspense';
import { Stats } from './stats';
import { Metadata } from './metadata';
import type { ErrorResponse } from '~/utils/errors';
import type { BeatmapDetailsQuery } from '~/server/queries';
import { Mapper } from './mapper';
import { Controls } from './controls';

export type HeaderProps = {
  details: BeatmapDetailsQuery;
};

export function Header(props: HeaderProps) {
  const beatmap = () => props.details?.beatmap;
  const beatmapset = () => props.details?.beatmapset;

  return (
    <div class='bg-[#fff1] min-h-[364px] flex'>
      <NavSuspense fallback={<Throbber />}>
        <Show
          when={beatmap() && beatmapset()}
          fallback={
            <Error response={props.details as unknown as ErrorResponse} />
          }
        >
          <div
            class='absolute inset-0 bg-cover bg-center -z-10'
            style={{
              'background-image': `url(${beatmapset().covers['cover@2x']})`,
            }}
          />
          <div class='min-h-[364px] md:px-10 px-5 pt-5 bg-[#0006] flex md:flex-row flex-col gap-[20px]'>
            <div
              class='flex flex-col'
              style={{ 'text-shadow': '0 1px 3px rgba(0,0,0,.75)' }}
            >
              <Difficulties beatmapset={beatmapset()} selected={beatmap()} />

              <div class='mt-auto'>
                <h1 class='text-3xl font-medium'>{beatmapset().title}</h1>
                <h2 class='text-xl'>{beatmapset().artist}</h2>
              </div>

              <Mapper beatmapset={beatmapset()} />

              <Controls beatmap={beatmap()} beatmapset={beatmapset()} />
            </div>
            <div class='md:ml-auto md:mt-auto min-w-[275px] flex flex-col gap-[1px]'>
              <HorizontalPlayer url={beatmapset().preview_url} />

              <Stats beatmap={beatmap()} />

              <Metadata beatmap={beatmap()} beatmapset={beatmapset()} />
            </div>
          </div>
          <Portal mount={document.getElementById('backdrop')!}>
            <div
              class='fixed inset-0 bg-cover bg-center'
              style={{
                'background-image': `url(${beatmapset().covers['cover@2x']})`,
              }}
            />
          </Portal>
        </Show>
      </NavSuspense>
    </div>
  );
}
