import { A, type AnchorProps } from '@solidjs/router';
import type { ParentProps } from 'solid-js';

export function AnchorButton(props: ParentProps & AnchorProps) {
  return (
    <A
      target='_blank'
      class='h-full p-[10px] bg-[#0005] hover:bg-[#0007] transition-colors text-xs font-medium flex items-center justify-center rounded-[10px] backdrop-blur-sm'
      data-umami-event-url={props.href}
      {...props}
    >
      <div class='flex items-center gap-[20px]'>{props.children}</div>
    </A>
  );
}
