import { A } from '@solidjs/router';
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';
import { similarityColor } from '../../../difficulties/colors';
import { Progress } from '~/features/ui/progress';
import { CircularPlayer } from './circular-player';
import { DifficultyChip } from './difficulty-chip';
import { DifficultyBars } from '../../difficulty-bars';
import { ModeIcon } from '~/features/recommendations/mode-icon';
import type { RekosuBeatmapset } from '~/server/data';

export type CardProps = {
  beatmapset: RekosuBeatmapset;
};

export function Card(props: CardProps) {
  let cardRef: HTMLDivElement = null!;
  const id = createUniqueId();

  const beatmaps = createMemo(() =>
    props.beatmapset.beatmaps.sort(
      (a, b) =>
        (a.similarity ? -a.similarity : a.difficulty_rating) -
        (b.similarity ? -b.similarity : b.difficulty_rating)
    )
  );

  const [expanded, setExpanded] = createSignal(false);

  return (
    <div
      ref={e => (cardRef = e)}
      class='relative'
      tabindex={0}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusIn={() => setExpanded(true)}
      onFocusOut={e => {
        if (e.relatedTarget && cardRef.contains(e.relatedTarget as HTMLElement))
          return;

        setExpanded(false);
      }}
    >
      <div
        class='h-[100px] bg-[#fff1] flex gap-[5px] rounded-[10px] overflow-hidden'
        style={{ 'text-shadow': '0 1px 3px rgba(0,0,0,.75)' }}
      >
        <div
          class='min-w-[100px] bg-cover rounded-[10px] flex items-center justify-center'
          style={{
            'background-image': `url(${props.beatmapset.covers['list@2x']})`,
            'background-position-x': '-10px',
          }}
        >
          <div class='motion-safe:animate-fade-in size-full'>
            <Show when={expanded()}>
              <CircularPlayer url={props.beatmapset.preview_url} id={id} />
            </Show>
          </div>
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
                mapped by{' '}
                <A
                  href={`https://osu.ppy.sh/users/${props.beatmapset.user_id}`}
                  target='_blank'
                  class='font-medium'
                >
                  {props.beatmapset.creator}
                </A>
              </div>
              <DifficultyBars beatmapset={props.beatmapset} />
            </div>
          </div>
        </div>
      </div>
      <Show when={expanded()}>
        <div class='motion-safe:animate-fade-in absolute w-full top-auto bg-[#26292b] border-2 border-t-0 rounded-b-[10px] border-[#fff6] z-10 p-[5px] max-h-[200px] overflow-y-auto'>
          <div class='flex flex-col gap-[2.5px]'>
            <For each={beatmaps()}>
              {(beatmap, index) => (
                <div class='flex gap-[5px] items-center text-sm hover:bg-[#fff1] rounded-xl px-0.5 py-0.5'>
                  <A
                    href={`/beatmaps/${beatmap.id}`}
                    class='flex gap-[5px] items-center w-full'
                  >
                    <ModeIcon
                      mode={beatmap.mode}
                      class='size-4 fill-white flex-shrink-0'
                    />
                    <DifficultyChip
                      difficultyRating={beatmap.difficulty_rating}
                    />
                    <span class='truncate'>{beatmap.version}</span>
                    <div class='ml-auto flex gap-[5px] items-center'>
                      {beatmap.similarity != null && (
                        <div class='flex gap-[5px] ml-auto items-center'>
                          <span>{(beatmap.similarity * 100).toFixed(1)}%</span>
                          <Progress
                            value={beatmap.similarity}
                            color={similarityColor(beatmap.similarity)}
                            class='md:w-[100px] w-[75px] flex-shrink-0'
                            delay={index() * 50}
                          />
                        </div>
                      )}
                      <span class='ml-auto min-w-12 text-right text-[#fff8]'>
                        {beatmap.maxPp != null
                          ? beatmap.maxPp?.toFixed(0)
                          : '? '}
                        pp
                      </span>
                    </div>
                  </A>
                </div>
              )}
            </For>
          </div>
        </div>
        <div class='motion-safe:animate-fade-in absolute inset-0 border-2 border-b-0 rounded-t-[10px] border-[#fff6] pointer-events-none' />
      </Show>
    </div>
  );
}
