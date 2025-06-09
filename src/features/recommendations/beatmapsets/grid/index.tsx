import { For, Match, Switch } from 'solid-js';
import { Card } from './card';
import { Throbber } from '~/features/ui/throbber';
import { Error } from '~/features/ui/error';
import { NavSuspense } from '~/features/ui/nav-suspense';
import type { ErrorResponse } from '~/utils/errors';
import type { RekosuBeatmapset } from '~/server/data';

export type GridProps = {
  beatmapsets: RekosuBeatmapset[];
};

export function Grid(props: GridProps) {
  return (
    <NavSuspense fallback={<Throbber />}>
      <Switch
        fallback={
          <Error response={props.beatmapsets as unknown as ErrorResponse} />
        }
      >
        <Match when={props.beatmapsets}>
          <div class='md:px-10 px-5 py-5 grid md:grid-cols-2 grid-cols-1 gap-[10px]'>
            <For each={props.beatmapsets}>
              {beatmapset => <Card beatmapset={beatmapset} />}
            </For>
          </div>
          <div class='text-xs text-[#fff6] text-center pt-[5px] pb-[15px]'>
            End of results
          </div>
        </Match>
      </Switch>
    </NavSuspense>
  );
}
