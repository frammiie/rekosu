import type { SimilarBeatmaps } from '~/server/queries';
import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';
import { similarityColor } from '../../difficulties/colors';
import { Progress } from '~/features/ui/progress';
import { HitCircle, ModeCircle } from '../../difficulties';
import { CircularPlayer } from './circular-player';
import { DifficultyChip } from './difficulty-chip';
import { DifficultyBars } from '../difficulty-bars';

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
          class='min-w-[100px] bg-cover rounded-[10px] flex items-center justify-center'
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
