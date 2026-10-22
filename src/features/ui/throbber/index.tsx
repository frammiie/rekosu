import { ModeIcon } from '~/features/recommendations/mode-icon';

export function Throbber() {
  return (
    <div class='size-full  flex items-center justify-center self-center my-auto opacity-25'>
      <ModeIcon mode='osu' class='size-28 fill-white motion-safe:animate-tap' />
    </div>
  );
}
