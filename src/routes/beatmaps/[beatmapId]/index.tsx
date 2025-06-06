import type { RouteDefinition } from '@solidjs/router';
import { createAsync, useAction, useParams } from '@solidjs/router';
import type { BeatmapDetails, SimilarBeatmaps } from '~/server/queries';
import { getBeatmap, getSimilarBeatmapsets } from '~/server/queries';
import { Grid } from '~/features/beatmaps/beatmapsets/grid';
import { Header } from '~/features/beatmaps/header';
import { AudioPlayerProvider } from '~/features/beatmaps/context/audio-player';
import { SectionHeader } from '~/features/ui/section-header';
import { createEffect, Show, type Accessor } from 'solid-js';
import { isServer } from 'solid-js/web';
import { trackRecentBeatmapset } from '~/server';
import { Title } from '@solidjs/meta';

export const route = {
  preload: ({ params }) => {
    getBeatmap(Number(params.beatmapId));
    getSimilarBeatmapsets(Number(params.beatmapId));
  },
} satisfies RouteDefinition;

export default function Beatmap() {
  const params = useParams();

  const beatmapDetails = createAsync(() =>
    getBeatmap(Number(params.beatmapId))
  ) as Accessor<BeatmapDetails>;

  const similarBeatmaps = createAsync(() =>
    getSimilarBeatmapsets(Number(params.beatmapId))
  ) as Accessor<SimilarBeatmaps>;

  const trackBeatmapset = useAction(trackRecentBeatmapset);

  createEffect(() => {
    if (isServer || !beatmapDetails()?.beatmapset) return;

    trackBeatmapset(beatmapDetails().beatmapset.id);
  });

  return (
    <main>
      <Show when={beatmapDetails()?.beatmapset}>
        <Title>{`Rekosu | ${beatmapDetails().beatmapset.title}`}</Title>
      </Show>
      <SectionHeader>Beatmap info</SectionHeader>
      <SectionHeader variant='secondary'>Info</SectionHeader>
      <AudioPlayerProvider>
        <Header details={beatmapDetails()} />

        <div class='bg-[#fff1] flex flex-col min-h-[500px]'>
          <SectionHeader variant='secondary'>
            Similar beatmaps
            <span class='text-xs opacity-50'>Results might be inaccurate</span>
          </SectionHeader>
          <Grid beatmapsets={similarBeatmaps()?.beatmapsets} />
        </div>
      </AudioPlayerProvider>
    </main>
  );
}
