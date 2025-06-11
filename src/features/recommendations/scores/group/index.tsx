import { A } from '@solidjs/router';
import { createMemo, Suspense } from 'solid-js';
import { Throbber } from '~/features/ui/throbber';
import type { RekosuUserScore, RekosuBeatmap } from '~/server/data';
import { formatDateTime } from '~/utils/formatting';
import { DifficultyChip } from '../../beatmapsets/grid/card/difficulty-chip';
import { GroupSimilarBeatmaps } from './group-similar-beatmaps';
import { Grade } from '../grade';

export type GroupProps = {
  score: RekosuUserScore;
  initialIndex: number;
};

export function Group(props: GroupProps) {
  const beatmap = createMemo(
    () =>
      ({
        ...props.score.beatmap,
        beatmapset: props.score.beatmapset,
      }) as RekosuBeatmap
  );

  return (
    <div>
      <div
        class='h-[50px] bg-[#fff1] bg-cover bg-center'
        style={{
          'background-image': `url(${beatmap().beatmapset!.covers['cover']})`,
          'text-shadow': '0 1px 3px rgba(0,0,0,.75)',
        }}
      >
        <div class='md:px-10 px-5 bg-[#000a] h-full flex items-center gap-[10px]'>
          <Grade grade={props.score.rank} />
          <div class='relative -top-[2px] min-w-0'>
            <A
              href={`/beatmaps/${beatmap().id}`}
              class='font-semibold block truncate'
            >
              {beatmap().beatmapset!.title}
            </A>
            <div class='text-xs leading-none flex gap-[5px] items-center'>
              <DifficultyChip difficultyRating={beatmap().difficulty_rating} />
              <span class='truncate'>
                {[
                  '',
                  beatmap().version,
                  `${props.score.pp != null ? props.score.pp.toFixed(0) : '? '}pp`,
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
