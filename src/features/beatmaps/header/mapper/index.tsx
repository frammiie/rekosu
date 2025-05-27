import { A } from '@solidjs/router';
import type { Beatmapset } from 'osu-api-v2-js';
import { Show } from 'solid-js';
import { formatDate } from '~/utils/formatting';

export type MapperProps = {
  beatmapset: Beatmapset.Extended.Plus;
};

export function Mapper(props: MapperProps) {
  return (
    <div class='mt-[20px] text-xs flex gap-[5px]'>
      <A
        href={`https://osu.ppy.sh/users/${props.beatmapset.user.id}`}
        target='_blank'
        class='block size-[50px] bg-contain rounded-md'
        style={{
          'background-image': `url(${props.beatmapset.user.avatar_url})`,
        }}
      />
      <div class='flex flex-col'>
        <div class='mb-[5px] leading-tight'>
          mapped by{' '}
          <A
            href={`https://osu.ppy.sh/users/${props.beatmapset.user.id}`}
            target='_blank'
            class='font-medium'
          >
            {props.beatmapset.user.username}
          </A>
        </div>
        <Show when={props.beatmapset.submitted_date}>
          <div class='leading-tight'>
            submitted{' '}
            <span class='font-medium'>
              {formatDate(props.beatmapset.submitted_date!)}
            </span>
          </div>
        </Show>
        <Show when={props.beatmapset.ranked_date}>
          <div class='leading-tight'>
            ranked{' '}
            <span class='font-medium'>
              {formatDate(props.beatmapset.ranked_date!)}
            </span>
          </div>
        </Show>
      </div>
    </div>
  );
}
