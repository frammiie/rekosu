import { useAuth } from '@solid-mediakit/auth/client';
import { ModeIcon } from '~/features/recommendations/mode-icon';

export function LoginButton() {
  const auth = useAuth();

  return (
    <button
      class='text-xs font-medium p-[10px] px-[15px] rounded-full bg-pink-400 bg-opacity-25 flex gap-[10px] items-center'
      onClick={() => auth.signIn('osu')}
      data-umami-event='sign-in-click'
    >
      Sign in with osu!
      <ModeIcon mode='osu' class='size-5 fill-white' />
    </button>
  );
}
