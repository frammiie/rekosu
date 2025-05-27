import type { AnchorProps } from '@solidjs/router';
import { A } from '@solidjs/router';

export function Link(props: AnchorProps) {
  return <A {...props} target='_blank' class='underline' />;
}
