import { useAuth } from '@solid-mediakit/auth/client';
import { A } from '@solidjs/router';
import type { ParentProps} from 'solid-js';
import { ErrorBoundary, Match, Switch } from 'solid-js';
import { isServer } from 'solid-js/web';

export default function Layout(props: ParentProps) {
  const auth = useAuth();

  // Sign out client-side upon indicated error
  if (!isServer && auth.session()?.error) {
    auth.signOut();
  }

  return (
    <div class='flex flex-col items-center overflow-visible mx-5'>
      <div class='-z-20'>
        <div id='backdrop' />
        <div class='fixed inset-0 bg-[#000b] backdrop-blur-xl' />
      </div>
      <div class='absolute -z-10 w-full min-h-[160px] bg-[#fff1]' />
      <div class='w-full max-w-[1000px]'>
        <header class='h-[90px] flex gap-4 items-center mb-[15px]'>
          <A
            href='/'
            class='text-xl font-medium hover:animate-spin hover:border-white size-[70px] text-center leading-[70px] rounded-full border-2 border-transparent select-none'
          >
            Rekosu
          </A>
          {/* <nav class='flex gap-[10px] mt-1'>
            <A href='/'>Home</A>
            <A href='/'>Statistics</A>
          </nav> */}
          <div class='ml-auto flex flex-col gap-[5px] items-end text-xs'>
            <Switch>
              <Match when={auth.status() === 'authenticated'}>
                <div class='flex gap-[10px] items-center'>
                  <div class='flex flex-col items-end'>
                    <div>You are logged in as {auth.session()?.user?.name}</div>
                    <button class='font-medium' onClick={() => auth.signOut()}>
                      Sign out
                    </button>
                  </div>
                  <div
                    class='size-10 bg-contain rounded-full'
                    style={{
                      'background-image': `url(${auth.session()?.user?.image})`,
                    }}
                  />
                </div>
              </Match>
              <Match when={auth.status() === 'unauthenticated'}>
                <button class='font-medium' onClick={() => auth.signIn('osu')}>
                  Sign in
                </button>
              </Match>
            </Switch>
          </div>
        </header>
        <ErrorBoundary fallback='Oopsie'>{props.children}</ErrorBoundary>
      </div>
    </div>
  );
}
