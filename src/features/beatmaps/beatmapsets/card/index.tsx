import type { SimilarBeatmaps } from '~/server/queries';
import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';
import { difficultyColor, similarityColor } from '../../difficulties/colors';
import { Progress } from '~/features/ui/progress';
import { HitCircle, ModeCircle } from '../../difficulties';
import { CircularPlayer } from './circular-player';
import type { Beatmap, Beatmapset } from 'osu-api-v2-js';

export type BeatmapsetCard = {
  beatmapset: SimilarBeatmaps['beatmapsets'][0];
};

export function Card(props: BeatmapsetCard) {
  return (
    <div
      class='relative group'
      style={{ 'text-shadow': '0 1px 3px rgba(0,0,0,.75)' }}
    >
      <div class='h-[100px] bg-[#fff1] flex gap-[5px] rounded-[10px] overflow-hidden'>
        <div
          class='min-w-[100px] bg-cover  rounded-[10px] flex items-center justify-center'
          style={{
            'background-image': `url(${props.beatmapset.covers['list@2x']})`,
            'background-position-x': '-10px',
          }}
        >
          <CircularPlayer url={props.beatmapset.preview_url} />
        </div>
        <div
          class='bg-cover bg-center w-full rounded-[10px] -ml-[10px] min-w-0'
          style={{
            'background-image': `url(${props.beatmapset.covers['card@2x']})`,
          }}
        >
          <div class='bg-gradient-to-r from-[#1a1a1a] to-[#0009] p-[10px] -ml-[10px] rounded-[10px] h-full flex'>
            <div class='min-w-0 flex flex-col'>
              <div class='truncate break-all leading-5'>
                {props.beatmapset.title}
              </div>
              <div class='text-sm truncate break-all leading-5'>
                By {props.beatmapset.artist}
              </div>
              <div class='text-xs leading-5 truncate break-all'>
                mapped by <b class='font-medium'>{props.beatmapset.creator}</b>
              </div>
              <DifficultyBars beatmapset={props.beatmapset} />
            </div>
          </div>
        </div>
      </div>
      <div class='hidden group-hover:block group-hover:motion-safe:animate-fade-in absolute w-full top-auto bg-[#26292b] border-2 border-t-0 rounded-b-[10px] border-[#fff6] z-10 p-[5px]'>
        <div class='flex flex-col gap-[2.5px]'>
          <For each={props.beatmapset.beatmaps}>
            {(beatmap, index) => (
              <div class='flex gap-[5px] items-center text-sm hover:bg-[#fff1] rounded-xl px-2 py-0.5'>
                <A
                  href={`/beatmaps/${beatmap.id}`}
                  class='flex gap-[5px] items-center w-full'
                >
                  <Show
                    when={beatmap.mode === 'osu'}
                    fallback={
                      <ModeCircle
                        mode={beatmap.mode}
                        class='size-4 text-[0.6rem] flex-shrink-0'
                      />
                    }
                  >
                    <HitCircle class='size-6 -m-1 flex-shrink-0' />
                  </Show>
                  <DifficultyChip
                    difficultyRating={beatmap.difficulty_rating}
                  />
                  <span class='break-all'>{beatmap.version}</span>
                  <div class='flex gap-[5px] ml-auto items-center'>
                    <span>{(beatmap.similarity * 100).toFixed(1)}%</span>
                    <Progress
                      value={beatmap.similarity}
                      color={similarityColor(beatmap.similarity)}
                      class='w-[150px] flex-shrink-0'
                      delay={index() * 50}
                    />
                  </div>
                </A>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class='hidden group-hover:block absolute inset-0 border-2 border-b-0 rounded-t-[10px] border-[#fff6] pointer-events-none' />
    </div>
  );
}

type DifficultyChipProps = {
  difficultyRating: number;
};

function DifficultyChip(props: DifficultyChipProps) {
  return (
    <div
      style={{
        'background-color': difficultyColor(props.difficultyRating),
        'text-shadow': 'none',
      }}
      classList={{
        'text-black': props.difficultyRating < 6.5,
        'text-yellow-400': props.difficultyRating >= 6.5,
      }}
      class='text-xs rounded-full inline-flex items-center gap-[2.5px] px-[5px] w-[50px] font-medium'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        class='size-3'
      >
        <path
          fill='currentColor'
          d='M10.846 3.822c.427-1.027 1.88-1.027 2.308 0l1.743 4.19l4.524.363c1.108.089 1.558 1.472.713 2.195l-3.447 2.953l1.053 4.415c.258 1.081-.918 1.936-1.867 1.357L12 16.929l-3.873 2.366c-.95.58-2.126-.276-1.868-1.357l1.053-4.415l-3.447-2.953c-.844-.723-.395-2.106.714-2.195l4.524-.363z'
        />
      </svg>
      {props.difficultyRating.toFixed(2)}
    </div>
  );
}

type DifficultyBarsProps = {
  beatmapset: Beatmapset.Extended.WithBeatmap;
};

function DifficultyBars(props: DifficultyBarsProps) {
  return (
    <div class='overflow-hidden flex gap-[2px] mt-auto items-center'>
      <For
        each={Object.entries(
          Object.groupBy(props.beatmapset.beatmaps, beatmap => beatmap.mode)
        )}
      >
        {([mode, beatmaps]) => (
          <>
            <Show
              when={mode === 'osu'}
              fallback={
                <ModeCircle
                  mode={mode as Beatmap['mode']}
                  class='size-[14px] text-[0.6rem] flex-shrink-0'
                />
              }
            >
              <HitCircle class='size-5 -m-0.5 flex-shrink-0' />
            </Show>
            <For each={beatmaps}>
              {beatmap => (
                <div
                  class='min-w-[6px] h-[12px] rounded-full'
                  style={{
                    'background-color': difficultyColor(
                      beatmap.difficulty_rating
                    ),
                  }}
                />
              )}
            </For>
          </>
        )}
      </For>
    </div>
  );
}
