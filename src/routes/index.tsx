import { useAuth } from '@solid-mediakit/auth/client';
import { Title } from '@solidjs/meta';
import { A, createAsync } from '@solidjs/router';
import { Show, type Accessor } from 'solid-js';
import { Beatmapsets } from '~/features/recommendations/beatmapsets';
import { AudioPlayerProvider } from '~/features/recommendations/context/audio-player';
import { Scores } from '~/features/recommendations/scores';
import { Backdrop } from '~/features/ui/backdrop';
import { SectionHeader } from '~/features/ui/section-header';
import {
  getRecentBeatmapsets,
  type RecentBeatmapsetsQuery,
} from '~/server/queries';

export default function Home() {
  const auth = useAuth();

  const recentBeatmapsets = createAsync(() =>
    getRecentBeatmapsets()
  ) as Accessor<RecentBeatmapsetsQuery>;

  return (
    <main class='bg-[#fff1] min-h-[500px] flex flex-col'>
      <Title>Rekosu | Home</Title>
      <SectionHeader>Home</SectionHeader>
      <SectionHeader variant='secondary'>Recent Beatmaps</SectionHeader>
      <AudioPlayerProvider>
        <Beatmapsets.Grid
          beatmapsets={recentBeatmapsets()?.beatmapsets.slice(0, 8)}
        />
        <SectionHeader variant='secondary'>
          Recent Scores
          <Show when={auth.session()?.user?.id != null}>
            <A
              href={`/users/${auth.session()?.user?.id}`}
              class='ml-auto font-semibold text-xs'
            >
              View all
            </A>
          </Show>
        </SectionHeader>
        <Scores.Peek />
      </AudioPlayerProvider>
      <Backdrop
        backgroundImage={
          recentBeatmapsets()?.beatmapsets[0]?.covers['cover@2x']
        }
      />
    </main>
  );
}
