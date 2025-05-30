import type { RouteDefinition } from '@solidjs/router';
import { useParams } from '@solidjs/router';
import { getBeatmap, getSimilarBeatmapsets } from '~/server/queries';
import { Similar } from '~/features/beatmaps/similar';
import { Header } from '~/features/beatmaps/header';
import { AudioPlayerProvider } from '~/features/beatmaps/context/audio-player';
import { SectionHeader } from '~/features/ui/section-header';

export const route = {
  preload: ({ params }) => {
    getBeatmap(Number(params.beatmapId));
    getSimilarBeatmapsets(Number(params.beatmapId));
  },
} satisfies RouteDefinition;

export default function Beatmap() {
  const params = useParams();

  return (
    <main>
      <SectionHeader>Beatmap info</SectionHeader>
      <SectionHeader variant='secondary'>Info</SectionHeader>
      <AudioPlayerProvider>
        <Header beatmapId={Number(params.beatmapId)} />
        <Similar beatmapId={Number(params.beatmapId)} />
      </AudioPlayerProvider>
    </main>
  );
}
