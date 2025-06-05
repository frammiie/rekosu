import { useAuth } from '@solid-mediakit/auth/client';
import { A } from '@solidjs/router';
import { Switch, Match } from 'solid-js';
import { HitCircle } from '~/features/beatmaps/difficulties';

export function Header() {
  const auth = useAuth();

  return (
    <header class='h-[90px] flex gap-4 items-center mb-[15px]'>
      <A
        href='/'
        class='text-xl font-medium hover:animate-spin hover:border-white size-[70px] text-center leading-[70px] rounded-full border-2 border-transparent select-none'
      >
        Rekosu
      </A>
      <div class='ml-auto flex flex-col gap-[5px] items-end text-xs'>
        <Switch>
          <Match when={auth.status() === 'authenticated'}>
            <div class='flex gap-[10px] items-center'>
              <div class='flex flex-col items-end'>
                <div>You are logged in as {auth.session()?.user?.name}</div>
                <button
                  class='font-medium'
                  onClick={() => auth.signOut()}
                  data-umami-event='sign-out-click'
                >
                  Sign out
                </button>
              </div>
              <div
                class='size-10 bg-contain rounded-full hover:animate-spin'
                style={{
                  'background-image': `url(${auth.session()?.user?.image})`,
                }}
              />
            </div>
          </Match>
          <Match when={auth.status() === 'unauthenticated'}>
            <button
              class='font-medium p-[10px] px-[15px] rounded-full bg-pink-400 bg-opacity-25 flex gap-[5px] items-center'
              onClick={() => auth.signIn('osu')}
              data-umami-event='sign-in-click'
            >
              Sign in with osu!
              <HitCircle />
            </button>
          </Match>
        </Switch>
      </div>
    </header>
  );
}
