import { useAuth } from '@solid-mediakit/auth/client';
import type { ParentProps } from 'solid-js';
import { ErrorBoundary } from 'solid-js';
import { isServer } from 'solid-js/web';
import { Header } from './header';
import { Footer } from './footer';

export function Layout(props: ParentProps) {
  const auth = useAuth();

  if (!isServer && auth.status() === 'authenticated') {
    const session = auth.session();

    if (session?.user) {
      umami.identify({
        id: session.user.id ?? '',
        name: session.user.name ?? '',
      });
    }
  }

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
        <Header />
        <ErrorBoundary fallback='Oopsie'>{props.children}</ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}
