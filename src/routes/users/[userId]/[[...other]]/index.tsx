import { SectionHeader } from '~/features/ui/section-header';
import type { RekosuBeatmap, RekosuUser, RekosuUserScore } from '~/server/data';
import { AudioPlayerProvider } from '~/features/recommendations/context/audio-player';
import type { Accessor, JSX } from 'solid-js';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Suspense,
  Switch,
  untrack,
} from 'solid-js';
import { Throbber } from '~/features/ui/throbber';
import type { RouteDefinition } from '@solidjs/router';
import { A, createAsync, useParams, useSearchParams } from '@solidjs/router';
import { ModeIcon } from '~/features/recommendations/mode-icon';
import type {
  SimilarBeatmapsQuery,
  UserQuery,
  UserScoresQuery,
} from '~/server/queries';
import {
  getSimilarBeatmapsets,
  getUser,
  getUserScores,
} from '~/server/queries';
import { z } from 'zod';
import { formatDateTime } from '~/utils/formatting';
import type { Score } from 'osu-api-v2-js';
import { DifficultyChip } from '~/features/recommendations/beatmapsets/grid/card/difficulty-chip';
import { createVisibilityObserver } from '@solid-primitives/intersection-observer';
import { Card } from '~/features/recommendations/beatmapsets/grid/card';
import { Error } from '~/features/ui/error';
import type { ErrorResponse } from '~/utils/errors';
import { usePageVisibility } from '@solid-primitives/page-visibility';

export const route = {
  preload: ({ params }) => {
    getUser(Number(params.userId));
  },
} satisfies RouteDefinition;

export default function User() {
  const params = useParams();

  const user = createAsync(() =>
    getUser(Number(params.userId))
  ) as Accessor<UserQuery>;

  return (
    <main class='bg-[#fff1]'>
      <Show when={user()}>
        <SectionHeader>Profile | {user().user.username}</SectionHeader>
        <Scores user={user().user} />
      </Show>
    </main>
  );
}

type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  variant?: 'regular' | 'round';
};

function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={['py-[5px] rounded-full', props.class].filter(Boolean).join(' ')}
      classList={{
        'bg-[#fff1]': !props.active,
        'bg-[#fff3]': props.active,
        'px-[15px]': !props.variant || props.variant === 'regular',
        'px-[10px]': props.variant === 'round',
      }}
    />
  );
}

type ScoresProps = {
  user: RekosuUser;
};

const filterSchema = z.object({
  type: z
    .union([z.literal('recent'), z.literal('best'), z.literal('firsts')])
    .optional(),
  mode: z
    .union([
      z.literal('osu'),
      z.literal('taiko'),
      z.literal('fruits'),
      z.literal('mania'),
    ])
    .optional(),
});

type ScoresFilter = Required<z.infer<typeof filterSchema>> & {
  lastRefresh: number;
};

function Scores(props: ScoresProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchFilter = filterSchema.safeParse(searchParams);

  const [filter, setFilter] = createSignal<ScoresFilter>({
    type: initialSearchFilter.data?.type ?? 'recent',
    // eslint-disable-next-line solid/reactivity
    mode: initialSearchFilter.data?.mode ?? props.user.playmode,
    lastRefresh: Date.now(),
  });

  createEffect(() => {
    setSearchParams({
      type: filter().type,
      mode: filter().mode,
    });
  });

  function handleTypeChange(type: ScoresFilter['type']) {
    setFilter(filter => ({ ...filter, type }));
  }

  function handleModeChange(mode: ScoresFilter['mode']) {
    setFilter(filter => ({ ...filter, mode }));
  }

  function handleRefreshClick() {
    setFilter(filter => ({
      ...filter,
      lastRefresh: Date.now(),
    }));
  }

  const visible = usePageVisibility();

  createEffect(() => {
    if (!visible()) return;

    const _filter = untrack(filter);
    if (_filter.type !== 'recent') return;
    if (Date.now() - _filter.lastRefresh < 10_000) return;

    handleRefreshClick();
  });

  return (
    <>
      <SectionHeader variant='secondary'>Score Recommendations</SectionHeader>
      <div class='md:px-10 px-5 py-[20px] pt-[15px] flex gap-[20px] flex-wrap'>
        <div class='flex flex-col gap-[5px]'>
          <div class='text-sm text-[#fffa]'>Type</div>
          <div class='flex gap-[10px]'>
            <Button
              active={filter().type === 'recent'}
              onClick={() => handleTypeChange('recent')}
            >
              Recent
            </Button>
            <Button
              active={filter().type === 'best'}
              onClick={() => handleTypeChange('best')}
            >
              Best
            </Button>
          </div>
        </div>
        <div class='flex flex-col gap-[5px]'>
          <div class='text-sm text-[#fffa]'>Mode</div>
          <div class='flex gap-[10px]'>
            <Button
              active={filter().mode === 'osu'}
              variant='round'
              onClick={() => handleModeChange('osu')}
            >
              <ModeIcon mode='osu' class='fill-white size-5 h-6' />
            </Button>
            <Button
              active={filter().mode === 'taiko'}
              variant='round'
              onClick={() => handleModeChange('taiko')}
            >
              <ModeIcon mode='taiko' class='fill-white size-5 h-6' />
            </Button>
            <Button
              active={filter().mode === 'fruits'}
              variant='round'
              onClick={() => handleModeChange('fruits')}
            >
              <ModeIcon mode='fruits' class='fill-white size-5 h-6' />
            </Button>
            <Button
              active={filter().mode === 'mania'}
              variant='round'
              onClick={() => handleModeChange('mania')}
            >
              <ModeIcon mode='mania' class='fill-white size-5 h-6' />
            </Button>
          </div>
        </div>
        <div class='ml-auto mt-auto'>
          <Button class='flex gap-[5px] group' onClick={handleRefreshClick}>
            Refresh
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              class='fill-white transition-transform group-hover:rotate-180 duration-200'
            >
              <path d='M13.685 5.25h.03a.75.75 0 0 1 0 1.5c-1.292 0-2.275 0-3.058.063c-.785.063-1.283.183-1.636.371a3.94 3.94 0 0 0-1.677 1.764c-.19.394-.304.88-.363 1.638c-.06.764-.06 1.738-.06 3.094v.11l1.12-1.12a.75.75 0 0 1 1.06 1.06l-2.4 2.4a.75.75 0 0 1-1.086-.027l-2.171-2.4a.75.75 0 0 1 1.112-1.006l.865.956v-.005c0-1.317 0-2.35.065-3.179c.066-.844.202-1.542.509-2.176a5.44 5.44 0 0 1 2.319-2.431c.625-.335 1.37-.476 2.224-.544c.85-.068 1.891-.068 3.147-.068m4.162 2.4a.75.75 0 0 1 .538.247l2.171 2.4a.75.75 0 0 1-1.112 1.006l-.865-.956v.005c0 1.317 0 2.35-.065 3.179c-.066.844-.201 1.542-.509 2.176a5.44 5.44 0 0 1-2.319 2.431c-.625.335-1.37.476-2.224.544c-.85.068-1.891.068-3.146.068h-.03a.75.75 0 0 1 0-1.5c1.291 0 2.274 0 3.057-.063c.785-.063 1.283-.183 1.636-.372a3.94 3.94 0 0 0 1.677-1.763c.19-.394.304-.88.363-1.638c.06-.764.06-1.738.06-3.094v-.11l-1.12 1.12a.75.75 0 0 1-1.06-1.06l2.4-2.4a.75.75 0 0 1 .548-.22' />
            </svg>
          </Button>
        </div>
      </div>
      <ScoresList user={props.user} filter={filter} />
    </>
  );
}

type ScoresListProps = {
  user: RekosuUser;
  filter: Accessor<ScoresFilter>;
};

function ScoresList(props: ScoresListProps) {
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
              {(score, index) => (
                <div class='motion-safe:animate-fade-in'>
                  <Group
                    score={score}
                    beatmap={
                      {
                        ...score.beatmap,
                        beatmapset: score.beatmapset,
                      } as RekosuBeatmap
                    }
                    initialIndex={index()}
                  />
                </div>
              )}
            </For>
          </Match>
          <Match when={scores.latest?.scores.length === 0}>
            <div class='min-h-[300px] md:px-10 px-5 flex items-center justify-center text-[#fff8]'>
              No scores found...
            </div>
          </Match>
        </Switch>
      </div>
    </AudioPlayerProvider>
  );
}

type GradeProps = {
  grade: Score.Grade;
};

function Grade(props: GradeProps) {
  return (
    <span
      class='px-[15px] rounded-full'
      classList={{
        'bg-pink-600 text-orange-300': props.grade === 'X',
        'bg-pink-600 text-gray-200': props.grade === 'XH',
        'bg-sky-600 text-orange-300': props.grade === 'S',
        'bg-sky-600 text-gray-200': props.grade === 'SH',
        'text-black text-opacity-50':
          props.grade.charCodeAt(0) >= 'A'.charCodeAt(0) &&
          props.grade.charCodeAt(0) <= 'F'.charCodeAt(0),
        'bg-lime-500': props.grade === 'A',
        'bg-yellow-500': props.grade === 'B',
        'bg-orange-500': props.grade === 'C',
        'bg-red-500': ['D', 'F'].includes(props.grade),
      }}
      style={{ 'text-shadow': 'none' }}
    >
      {['XH', 'X'].includes(props.grade)
        ? 'SS'
        : props.grade === 'SH'
          ? 'S'
          : props.grade}
    </span>
  );
}

type GroupProps = {
  score: RekosuUserScore;
  beatmap: RekosuBeatmap;
  initialIndex: number;
};

function Group(props: GroupProps) {
  return (
    <div>
      <div
        class='h-[50px] bg-[#fff1] bg-cover bg-center'
        style={{
          'background-image': `url(${props.beatmap.beatmapset!.covers['cover']})`,
          'text-shadow': '0 1px 3px rgba(0,0,0,.75)',
        }}
      >
        <div class='md:px-10 px-5 bg-[#000a] h-full flex items-center gap-[10px]'>
          <Grade grade={props.score.rank} />
          <div class='relative -top-[2px] min-w-0'>
            <A
              href={`/beatmaps/${props.beatmap.id}`}
              class='font-semibold block truncate'
            >
              {props.beatmap.beatmapset!.title}
            </A>
            <div class='text-xs leading-none flex gap-[5px] items-center'>
              <DifficultyChip
                difficultyRating={props.beatmap.difficulty_rating}
              />
              <span class='truncate'>
                {[
                  '',
                  props.beatmap.version,
                  `${props.score.pp?.toFixed(0)}pp`,
                  `${(props.score.accuracy * 100).toFixed(2)}%`,
                  `${props.score.max_combo}x`,
                ].join(' | ')}
              </span>
            </div>
          </div>
          <span class='text-xs ml-auto text-right min-w-fit'>
            <div class='md:block hidden'>
              Last played on {formatDateTime(props.score.ended_at)}
            </div>
            <div class='md:hidden'>{formatDateTime(props.score.ended_at)}</div>
            <A
              href={`https://osu.ppy.sh/scores/${props.score.id}`}
              target='_blank'
              class='font-semibold'
            >
              View score
            </A>
          </span>
        </div>
      </div>
      <div>
        <Suspense
          fallback={
            <div class='min-h-[360px] flex'>
              <Throbber />
            </div>
          }
        >
          <GroupSimilarBeatmaps
            score={props.score}
            initialIndex={props.initialIndex}
          />
        </Suspense>
      </div>
    </div>
  );
}

type GroupSimilarBeatmaps = {
  score: RekosuUserScore;
  initialIndex: number;
};

function GroupSimilarBeatmaps(props: GroupSimilarBeatmaps) {
  let containerRef: HTMLDivElement | undefined;

  const visible = createVisibilityObserver({
    initialValue: false,
  })(() => containerRef);

  const [enabled, setEnabled] = createSignal(props.initialIndex < 3);

  createEffect(() => {
    if (enabled() || !visible()) return;

    setEnabled(true);
  });

  const [similarBeatmaps] = createResource<
    SimilarBeatmapsQuery | null,
    number | null
  >(
    () => (enabled() ? props.score.beatmap.id : null),
    (beatmapId: number | null) => {
      if (!beatmapId) return null;

      return getSimilarBeatmapsets(
        beatmapId,
        25
      ) as Promise<SimilarBeatmapsQuery | null>;
    }
  );

  return (
    <div
      ref={containerRef}
      class='md:px-10 px-5 py-5 grid md:grid-cols-2 grid-cols-1 gap-[10px] w-full'
    >
      <For each={similarBeatmaps()?.beatmapsets.slice(0, 6)}>
        {beatmapset => <Card beatmapset={beatmapset} />}
      </For>
    </div>
  );
}
