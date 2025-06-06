import { ModeIcon } from '~/features/beatmaps/mode-icon';

export function Throbber() {
  return (
    <div class='w-full h-full flex items-center justify-center self-center my-auto opacity-25'>
      <ModeIcon mode='osu' class='size-28 fill-white motion-safe:animate-tap' />
    </div>
  );
}
