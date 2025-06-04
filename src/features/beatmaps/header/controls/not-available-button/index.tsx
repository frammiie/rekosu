import { A } from '@solidjs/router';
import type { Beatmapset } from 'osu-api-v2-js';
import { Show } from 'solid-js';

export type NotAvailableProps = {
  availability: Beatmapset.Extended['availability'];
};

export function NotAvailableButton(props: NotAvailableProps) {
  return (
    <div class='my-auto px-[10px] h-full bg-[#0006] backdrop-blur-sm rounded-[10px] flex flex-col justify-center'>
      <div class='text-yellow-500 text-xs font-medium'>
        This beatmapset is currently not available
      </div>
      <Show when={props.availability.more_information}>
        <A
          href={props.availability.more_information!}
          class='text-xs underline text-gray-300'
          target='_blank'
          data-umami-event='not-available-information-click'
          data-umami-event-url={props.availability.more_information}
        >
          Check here for more information
        </A>
      </Show>
    </div>
  );
}
