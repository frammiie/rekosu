import { createAsync } from '@solidjs/router';
import { Accessor, For, Match, Switch } from 'solid-js';
import { getSimilarBeatmapsets } from '~/server';
import { Card } from '../beatmapsets/card';
import { Throbber } from '~/features/ui/throbber';
import { Error } from '~/features/ui/error';
import { NavSuspense } from '~/features/ui/nav-suspense';
import { SimilarBeatmaps } from '~/server/queries';

export type SimilarProps = {
  beatmapId: number;
};

export function Similar(props: SimilarProps) {
  const similarBeatmaps = createAsync(() =>
    getSimilarBeatmapsets(props.beatmapId)
  ) as unknown as Accessor<SimilarBeatmaps>;

  return (
    <div class='bg-[#fff1] min-h-[500px] flex flex-col'>
      <div class='h-[50px] px-5 bg-[#fff1] flex items-center gap-[5px]'>
        Similar beatmaps
        <span class='text-xs opacity-50'>Results might be inaccurate</span>
      </div>
      <NavSuspense fallback={<Throbber />}>
        <Switch fallback={<Error response={similarBeatmaps()} />}>
          <Match when={similarBeatmaps()?.beatmapsets?.length}>
            <div class='px-5 py-[10px] grid grid-cols-2 gap-[10px]'>
              <For each={similarBeatmaps()?.beatmapsets}>
                {beatmapset => <Card beatmapset={beatmapset} />}
              </For>
            </div>
            <div class='text-xs opacity-50 text-center pt-[5px] pb-[15px]'>
              End of results
            </div>
          </Match>
        </Switch>
      </NavSuspense>
    </div>
  );
}
