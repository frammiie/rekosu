import type { ParentProps } from 'solid-js';

export type SectionHeaderProps = ParentProps<{
  variant?: 'primary' | 'secondary';
}>;

export function SectionHeader(props: SectionHeaderProps) {
  return (
    <div
      classList={{
        'h-[55px]': !props.variant || props.variant === 'primary',
        'h-[50px]': props.variant === 'secondary',
      }}
      class='px-10 bg-[#fff1] flex items-center'
      children={props.children}
    />
  );
}
