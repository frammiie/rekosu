import { Title } from '@solidjs/meta';
import { createAsync } from '@solidjs/router';
import type { Accessor } from 'solid-js';
import { Grid } from '~/features/beatmaps/beatmapsets/grid';
import { AudioPlayerProvider } from '~/features/beatmaps/context/audio-player';
import { Search } from '~/features/beatmaps/search';
import { SectionHeader } from '~/features/ui/section-header';
import {
  getRecentBeatmapsets,
  type RecentBeatmapsetsQuery,
} from '~/server/queries';

export default function Home() {
  const recentBeatmapsets = createAsync(() =>
    getRecentBeatmapsets()
  ) as Accessor<RecentBeatmapsetsQuery>;

  return (
    <main class='bg-[#fff1] min-h-[500px] flex flex-col'>
      <Title>Rekosu | Home</Title>
      <SectionHeader>Home</SectionHeader>
      <SectionHeader variant='secondary'>Recent Beatmaps</SectionHeader>
      <AudioPlayerProvider>
        <Grid beatmapsets={recentBeatmapsets()?.beatmapsets} />
      </AudioPlayerProvider>
      <SectionHeader variant='secondary'>Search</SectionHeader>
      <Search />
    </main>
  );
}
