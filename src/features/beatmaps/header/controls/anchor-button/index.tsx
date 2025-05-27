import { A, type AnchorProps } from '@solidjs/router';
import type { ParentProps } from 'solid-js';

export function AnchorButton(props: ParentProps & Pick<AnchorProps, 'href'>) {
  return (
    <A
      href={props.href}
      target='_blank'
      class='h-full p-[10px] bg-[#0005] hover:bg-[#0007] transition-colors text-xs font-medium flex items-center justify-center rounded-[10px] backdrop-blur-sm'
    >
      <div class='flex items-center gap-[20px]'>{props.children}</div>
    </A>
  );
}
