import type { JSX } from 'solid-js';

export type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  variant?: 'regular' | 'round';
};

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={['py-[5px] rounded-full', props.class].filter(Boolean).join(' ')}
      classList={{
        'bg-[#fff1]': !props.active,
        'bg-[#fff3]': props.active,
        'px-[15px]': !props.variant || props.variant === 'regular',
        'px-[10px]': props.variant === 'round',
      }}
    />
  );
}
