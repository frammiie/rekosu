import { useAuth } from '@solid-mediakit/auth/client';
import { A } from '@solidjs/router';
import type { ParentProps } from 'solid-js';
import { ErrorBoundary, Match, Switch } from 'solid-js';
import { isServer } from 'solid-js/web';
import { Link } from '~/features/ui/link';

export default function Layout(props: ParentProps) {
  const auth = useAuth();

  // Sign out client-side upon indicated session error
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
                    class='size-10 bg-contain rounded-full hover:animate-spin'
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
      <footer class='mt-[20px] w-full max-w-[1000px]  bg-[#fff1] p-[20px] text-xs text-[#fff6] flex flex-col gap-[10px]'>
        <div class='text-center'>
          Made with ❤︎ by{' '}
          <Link href='https://huggingface.co/frammie'>@frammie</Link>
        </div>
        <div>With help from:</div>
        <ul class='flex flex-col gap-[5px]'>
          <li>
            <Link href='https://www.answer.ai/'>Answer.AI</Link> for{' '}
            <Link href='https://github.com/AnswerDotAI/ModernBERT'>
              ModernBERT
            </Link>
          </li>
          <li>
            <Link href='https://github.com/UKPLab'>UKPLab</Link> for{' '}
            <Link href='https://github.com/UKPLab/sentence-transformers'>
              Sentence Transformers
            </Link>
          </li>
          <li>
            <Link href='https://github.com/TTTaevas'>@TTTaevas</Link> for{' '}
            <Link href='https://github.com/TTTaevas/osu-api-v2-js'>
              osu-api-v2
            </Link>
          </li>
          <li>
            <Link href='https://ppy.sh/'>@ppy</Link> and contributors for{' '}
            <Link href='https://osu.ppy.sh/docs/index.html'>osu!api v2</Link>
          </li>
          <li>
            <Link href='https://x.com/RyanCarniato'>Ryan Carniato</Link> and
            contributors for{' '}
            <Link href='https://docs.solidjs.com/'>SolidJS</Link> &{' '}
            <Link href='https://docs.solidjs.com/solid-start'>SolidStart</Link>
          </li>
          <li>
            <Link href='https://authjs.dev/contributors'>
              AuthJS contributors
            </Link>{' '}
            for <Link href='https://authjs.dev/'>Auth.js</Link>
          </li>
          <li>
            <Link href='https://github.com/OrJDev'>ORJDev</Link> and
            contributors for{' '}
            <Link href='https://github.com/solidjs-community/mediakit'>
              mediakit
            </Link>
          </li>
        </ul>
        <div>And many more awesome folks!</div>
      </footer>
    </div>
  );
}
