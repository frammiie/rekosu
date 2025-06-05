import type { Beatmap, Beatmapset } from 'osu-api-v2-js';
import type { ProgressProps } from '~/features/ui/progress';
import { Progress } from '~/features/ui/progress';

export type MetadataProps = {
  beatmap: Beatmap.Extended;
  beatmapset: Beatmapset & { rating: number };
};

export function Metadata(props: MetadataProps) {
  return (
    <div class='bg-[#0005] h-full p-[10px] flex flex-col gap-[5px] backdrop-blur-sm pb-[50px]'>
      <Attribute label='Circle Size' value={props.beatmap.cs} />
      <Attribute label='HP Drain' value={props.beatmap.drain} delay={100} />
      <Attribute label='Accuracy' value={props.beatmap.accuracy} delay={200} />
      <Attribute label='Approach Rate' value={props.beatmap.ar} delay={300} />
      <Attribute
        label='Star Rating'
        value={props.beatmap.difficulty_rating}
        delay={400}
        color='rgb(234 179 8)'
        decimals={2}
      />
      <Attribute
        label='User Rating'
        value={props.beatmapset.rating}
        delay={500}
        color='rgb(34 197 94)'
        decimals={2}
      />
    </div>
  );
}

type AttributeProps = ProgressProps & {
  label: string;
  decimals?: number;
};

function Attribute(props: AttributeProps) {
  return (
    <div class='flex gap-[5px] items-center text-xs'>
      <span class='w-[90px]'>{props.label}</span>
      <Progress {...props} value={props.value / 10} class='flex-1' />
      <span class='w-[30px] text-center'>
        {Math.floor(props.value) === props.value
          ? props.value
          : props.value.toFixed(props.decimals ?? 1)}
      </span>
    </div>
  );
}
