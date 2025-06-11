import type { Score } from 'osu-api-v2-js';

export type GradeProps = {
  grade: Score.Grade;
};

export function Grade(props: GradeProps) {
  return (
    <span
      class='px-[15px] rounded-full'
      classList={{
        'bg-pink-600 text-orange-300': props.grade === 'X',
        'bg-pink-600 text-gray-200': props.grade === 'XH',
        'bg-sky-600 text-orange-300': props.grade === 'S',
        'bg-sky-600 text-gray-200': props.grade === 'SH',
        'text-black text-opacity-50':
          props.grade.charCodeAt(0) >= 'A'.charCodeAt(0) &&
          props.grade.charCodeAt(0) <= 'F'.charCodeAt(0),
        'bg-lime-500': props.grade === 'A',
        'bg-yellow-500': props.grade === 'B',
        'bg-orange-500': props.grade === 'C',
        'bg-red-500': ['D', 'F'].includes(props.grade),
      }}
      style={{ 'text-shadow': 'none' }}
    >
      {['XH', 'X'].includes(props.grade)
        ? 'SS'
        : props.grade === 'SH'
          ? 'S'
          : props.grade}
    </span>
  );
}
