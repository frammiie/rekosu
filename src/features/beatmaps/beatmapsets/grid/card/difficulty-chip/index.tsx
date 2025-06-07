import { difficultyColor } from '~/features/beatmaps/difficulties/colors';

export type DifficultyChipProps = {
  difficultyRating: number;
};

export function DifficultyChip(props: DifficultyChipProps) {
  return (
    <div
      style={{
        'background-color': difficultyColor(props.difficultyRating),
        'text-shadow': 'none',
      }}
      classList={{
        'text-black': props.difficultyRating < 6.5,
        'text-yellow-400': props.difficultyRating >= 6.5,
      }}
      class='text-xs rounded-full inline-flex items-center gap-[2.5px] px-[5px] min-w-[50px] font-medium'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        class='size-3 flex-shrink-0'
      >
        <path
          fill='currentColor'
          d='M10.846 3.822c.427-1.027 1.88-1.027 2.308 0l1.743 4.19l4.524.363c1.108.089 1.558 1.472.713 2.195l-3.447 2.953l1.053 4.415c.258 1.081-.918 1.936-1.867 1.357L12 16.929l-3.873 2.366c-.95.58-2.126-.276-1.868-1.357l1.053-4.415l-3.447-2.953c-.844-.723-.395-2.106.714-2.195l4.524-.363z'
        />
      </svg>
      {props.difficultyRating.toFixed(2)}
    </div>
  );
}
