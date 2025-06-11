import type { Accessor } from 'solid-js';
import { ModeIcon } from '~/features/recommendations/mode-icon';
import { Button } from '~/features/ui/button';
import type { Filter } from '..';

export type FilterProps = {
  filter: Accessor<Filter>;
  onTypeChange: (type: Filter['type']) => void;
  onModeChange: (mode: Filter['mode']) => void;
  onRefresh: () => void;
};

export function Filter(props: FilterProps) {
  return (
    <div class='md:px-10 px-5 py-[20px] pt-[15px] flex gap-[20px] flex-wrap'>
      <div class='flex flex-col gap-[5px]'>
        <div class='text-sm text-[#fffa]'>Type</div>
        <div class='flex gap-[10px]'>
          <Button
            active={props.filter().type === 'recent'}
            onClick={() => props.onTypeChange('recent')}
          >
            Recent
          </Button>
          <Button
            active={props.filter().type === 'best'}
            onClick={() => props.onTypeChange('best')}
          >
            Best
          </Button>
        </div>
      </div>
      <div class='flex flex-col gap-[5px]'>
        <div class='text-sm text-[#fffa]'>Mode</div>
        <div class='flex gap-[10px]'>
          <Button
            active={props.filter().mode === 'osu'}
            variant='round'
            onClick={() => props.onModeChange('osu')}
          >
            <ModeIcon mode='osu' class='fill-white size-5 h-6' />
          </Button>
          <Button
            active={props.filter().mode === 'taiko'}
            variant='round'
            onClick={() => props.onModeChange('taiko')}
          >
            <ModeIcon mode='taiko' class='fill-white size-5 h-6' />
          </Button>
          <Button
            active={props.filter().mode === 'fruits'}
            variant='round'
            onClick={() => props.onModeChange('fruits')}
          >
            <ModeIcon mode='fruits' class='fill-white size-5 h-6' />
          </Button>
          <Button
            active={props.filter().mode === 'mania'}
            variant='round'
            onClick={() => props.onModeChange('mania')}
          >
            <ModeIcon mode='mania' class='fill-white size-5 h-6' />
          </Button>
        </div>
      </div>
      <div class='ml-auto mt-auto'>
        <Button class='flex gap-[5px] group' onClick={props.onRefresh}>
          Refresh
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            class='fill-white transition-transform group-hover:rotate-180 duration-200'
          >
            <path d='M13.685 5.25h.03a.75.75 0 0 1 0 1.5c-1.292 0-2.275 0-3.058.063c-.785.063-1.283.183-1.636.371a3.94 3.94 0 0 0-1.677 1.764c-.19.394-.304.88-.363 1.638c-.06.764-.06 1.738-.06 3.094v.11l1.12-1.12a.75.75 0 0 1 1.06 1.06l-2.4 2.4a.75.75 0 0 1-1.086-.027l-2.171-2.4a.75.75 0 0 1 1.112-1.006l.865.956v-.005c0-1.317 0-2.35.065-3.179c.066-.844.202-1.542.509-2.176a5.44 5.44 0 0 1 2.319-2.431c.625-.335 1.37-.476 2.224-.544c.85-.068 1.891-.068 3.147-.068m4.162 2.4a.75.75 0 0 1 .538.247l2.171 2.4a.75.75 0 0 1-1.112 1.006l-.865-.956v.005c0 1.317 0 2.35-.065 3.179c-.066.844-.201 1.542-.509 2.176a5.44 5.44 0 0 1-2.319 2.431c-.625.335-1.37.476-2.224.544c-.85.068-1.891.068-3.146.068h-.03a.75.75 0 0 1 0-1.5c1.291 0 2.274 0 3.057-.063c.785-.063 1.283-.183 1.636-.372a3.94 3.94 0 0 0 1.677-1.763c.19-.394.304-.88.363-1.638c.06-.764.06-1.738.06-3.094v-.11l-1.12 1.12a.75.75 0 0 1-1.06-1.06l2.4-2.4a.75.75 0 0 1 .548-.22' />
          </svg>
        </Button>
      </div>
    </div>
  );
}
