import type { JSX} from 'solid-js';
import { createEffect, createSignal, Show, Suspense } from 'solid-js';
import { useBeforeLeave, useIsRouting } from '@solidjs/router';

export type RouteSuspenseProps = {
  fallback?: JSX.Element;
  children: JSX.Element;
};

export function NavSuspense(props: RouteSuspenseProps) {
  const isRouting = useIsRouting();
  const [navigateMatches, setNavigateMatches] = createSignal(false);
  const [showFallback, setShowFallback] = createSignal(false);

  useBeforeLeave(e => {
    setNavigateMatches(cutPath(e.from.pathname).startsWith(cutPath(e.to)));
  });

  let timeoutId: NodeJS.Timeout | null = null;

  createEffect(() => {
    if (isRouting()) return;

    setNavigateMatches(false);
    setShowFallback(false);

    if (timeoutId) clearTimeout(timeoutId);
  });

  createEffect(() => {
    if (!navigateMatches() || !isRouting()) return;

    timeoutId = setTimeout(() => setShowFallback(true), 500);
  });

  return (
    <div class='relative w-full h-full m-auto'>
      <Suspense fallback={props.fallback}>
        {props.children}
        <Show when={showFallback()}>
          <div
            class='absolute inset-0 bg-[#0006] z-50'
            children={props.fallback}
          />
        </Show>
      </Suspense>
    </div>
  );
}

function cutPath(path: string | number) {
  return path.toString().split('/').slice(0, -1).join();
}
