import type { Accessor } from 'solid-js';
import { Show } from 'solid-js';
import { Difficulties } from '../difficulties';
import { HorizontalPlayer } from './horizontal-player';
import { createAsync } from '@solidjs/router';
import { getBeatmap } from '~/server';
import { Throbber } from '~/features/ui/throbber';
import { Error } from '~/features/ui/error';
import { Portal } from 'solid-js/web';
import { NavSuspense } from '~/features/ui/nav-suspense';
import { Stats } from './stats';
import { Metadata } from './metadata';
import type { ErrorResponse } from '~/utils/errors';
import type { BeatmapDetails } from '~/server/queries';
import { Mapper } from './mapper';
import { Controls } from './controls';

export type HeaderProps = {
  beatmapId: number;
};

export default function Header(props: HeaderProps) {
  const data = createAsync(() =>
    getBeatmap(Number(props.beatmapId))
  ) as Accessor<BeatmapDetails>;

  const beatmap = () => data()?.beatmap;
  const beatmapset = () => data()?.beatmapset;

  return (
    <div class='bg-[#fff1] min-h-[364px] flex'>
      <NavSuspense fallback={<Throbber />}>
        <Show
          when={beatmap() && beatmapset()}
          fallback={<Error response={data() as unknown as ErrorResponse} />}
        >
          <div
            class='absolute inset-0 bg-cover bg-center -z-10'
            style={{
              'background-image': `url(${beatmapset().covers['cover@2x']})`,
            }}
          />
          <div class='min-h-[364px] px-10 pt-5 bg-[#0006] flex'>
            <div
              class='flex flex-col'
              style={{ 'text-shadow': '0 1px 3px rgba(0,0,0,.75)' }}
            >
              <Difficulties
                selected={{
                  beatmapId: beatmap().id,
                  version: beatmap().version,
                  difficultyRating: beatmap().difficulty_rating,
                  mode: beatmap().mode,
                }}
                difficulties={beatmapset().beatmaps.map(beatmap => ({
                  beatmapId: beatmap.id,
                  version: beatmap.version,
                  difficultyRating: beatmap.difficulty_rating,
                  mode: beatmap.mode,
                }))}
              />

              <div class='mt-[50px]'>
                <h1 class='text-3xl font-medium'>{beatmapset().title}</h1>
                <h2 class='text-xl'>{beatmapset().artist}</h2>
              </div>

              <Mapper beatmapset={beatmapset()} />

              <Controls beatmap={beatmap()} beatmapset={beatmapset()} />
            </div>
            <div class='ml-auto mt-[40px] min-w-[275px] flex flex-col gap-[1px]'>
              <HorizontalPlayer url={beatmapset().preview_url} />

              <Stats beatmap={beatmap()} />

              <Metadata beatmap={beatmap()} beatmapset={beatmapset()} />
            </div>
          </div>
          <Portal mount={document.getElementById('backdrop')!}>
            <div
              class='fixed inset-0'
              style={{
                'background-image': `url(${beatmapset().covers['cover@2x']})`,
                'background-size': 'cover',
              }}
            />
          </Portal>
        </Show>
      </NavSuspense>
    </div>
  );
}
