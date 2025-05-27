import type { JSX } from 'solid-js';

export type ProgressProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value: number;
  color?: string;
  delay?: number;
};

export function Progress(props: ProgressProps) {
  return (
    <div
      {...props}
      class={['h-2 rounded-full bg-[#0006] relative', props.class].join(' ')}
    >
      <div
        class='h-full bg-[#fffc] rounded-full origin-left motion-safe:scale-x-0 motion-safe:animate-expand-width motion-safe:transition-[width]'
        style={{
          'background-color': props.color,
          width: `${props.value * 100}%`,
          'animation-delay': `${props.delay}ms`,
          'animation-fill-mode': 'forwards',
        }}
      />
    </div>
  );
}
