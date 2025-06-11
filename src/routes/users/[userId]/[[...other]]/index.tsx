import { SectionHeader } from '~/features/ui/section-header';
import type { Accessor } from 'solid-js';
import { Show } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';
import { createAsync, useParams } from '@solidjs/router';
import type { UserQuery } from '~/server/queries';
import { getUser } from '~/server/queries';
import { Scores } from '~/features/recommendations/scores';

export const route = {
  preload: ({ params }) => {
    getUser(Number(params.userId));
  },
} satisfies RouteDefinition;

export default function User() {
  const params = useParams();

  const user = createAsync(() =>
    getUser(Number(params.userId))
  ) as Accessor<UserQuery>;

  return (
    <main class='bg-[#fff1]'>
      <Show when={user()}>
        <SectionHeader>Profile | {user().user.username}</SectionHeader>
        <Scores.List user={user().user} />
      </Show>
    </main>
  );
}
