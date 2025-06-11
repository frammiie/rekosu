import type { Accessor } from 'solid-js';
import { Switch, Match, For } from 'solid-js';
import { useAuth } from '@solid-mediakit/auth/client';
import { createAsync } from '@solidjs/router';
import { LoginButton } from '~/features/ui/login-button';
import { getUserScores } from '~/server';
import type { UserScoresQuery } from '~/server/queries';
import type { ErrorResponse } from '~/utils/errors';
import { Group } from '../group';
import { Error } from '~/features/ui/error';

export function Peek() {
  const auth = useAuth();

  const recentScores = createAsync(async () => {
    if (auth.session()?.user?.id == null) {
      return null;
    }

    return getUserScores(Number(auth.session()!.user!.id), 'recent');
  }) as Accessor<UserScoresQuery | null>;

  return (
    <div>
      <Switch
        fallback={
          <Error response={recentScores() as unknown as ErrorResponse} />
        }
      >
        <Match when={recentScores()?.scores.length}>
          <For each={recentScores()?.scores.slice(0, 2)}>
            {(score, index) => <Group score={score} initialIndex={index()} />}
          </For>
        </Match>
        <Match when={recentScores()?.scores.length === 0}>
          <div class='min-h-[300px] flex items-center justify-center text-[#fff8]'>
            <div>No scores found...</div>
          </div>
        </Match>
        <Match when={recentScores() === null}>
          <div class='min-h-[300px] flex items-center justify-center'>
            <LoginButton />
          </div>
        </Match>
      </Switch>
    </div>
  );
}
