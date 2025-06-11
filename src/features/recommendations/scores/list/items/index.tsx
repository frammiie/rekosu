import type { Accessor } from 'solid-js';
import {
  Show,
  Switch,
  Match,
  For,
  createEffect,
  createResource,
} from 'solid-js';
import { AudioPlayerProvider } from '~/features/recommendations/context/audio-player';
import { Throbber } from '~/features/ui/throbber';
import { getUserScores } from '~/server';
import type { RekosuUser } from '~/server/data';
import type { UserScoresQuery } from '~/server/queries';
import type { ErrorResponse } from '~/utils/errors';
import type { Filter } from '..';
import { Group } from '../../group';
import { Error } from '~/features/ui/error';
import { Backdrop } from '~/features/ui/backdrop';

export type ItemsProps = {
  user: RekosuUser;
  filter: Accessor<Filter>;
};

export function Items(props: ItemsProps) {
  const [scores, { refetch }] = createResource<UserScoresQuery | null>(
    () =>
      getUserScores(
        props.user.id,
        props.filter().type,
        props.filter().mode
      ) as Promise<UserScoresQuery | null>
  );

  createEffect(prev => {
    if (!prev) return props.filter();

    refetch();

    return props.filter();
  });

  return (
    <AudioPlayerProvider>
      <div class='min-h-[300px] relative'>
        <Show when={scores.loading}>
          <div class='flex items-center h-full bg-[#0006] inset-0 absolute z-50 motion-safe:animate-delayed-fade-in motion-safe:opacity-0'>
            <Throbber />
          </div>
        </Show>
        <Switch
          fallback={
            <Error response={scores.latest as unknown as ErrorResponse} />
          }
        >
          <Match when={scores.latest?.scores.length}>
            <For each={scores.latest?.scores}>
              {(score, index) => <Group score={score} initialIndex={index()} />}
            </For>
          </Match>
          <Match when={scores.latest?.scores.length === 0}>
            <div class='min-h-[300px] md:px-10 px-5 flex items-center justify-center text-[#fff8]'>
              No scores found...
            </div>
          </Match>
        </Switch>
      </div>
      <Backdrop
        backgroundImage={
          scores.latest?.scores?.[0].beatmapset.covers['cover@2x']
        }
      />
    </AudioPlayerProvider>
  );
}
