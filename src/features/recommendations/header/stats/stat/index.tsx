import type { ParentProps } from 'solid-js';

export function Stat(props: ParentProps) {
  return (
    <div class='flex gap-[2.5px] text-sm items-center'>{props.children}</div>
  );
}
