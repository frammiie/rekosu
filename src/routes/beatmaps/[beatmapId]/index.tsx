import type { RouteDefinition } from '@solidjs/router';
import { useParams } from '@solidjs/router';
import { getBeatmap, getSimilarBeatmapsets } from '~/server/queries';
import { Similar } from '~/features/beatmaps/similar';
import Header from '~/features/beatmaps/header';
import { AudioPlayerProvider } from '~/features/beatmaps/context/audio-player';

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
      <div class='h-[55px] px-10 bg-[#fff1] flex items-center'>
        Beatmap info
      </div>
      <div class='h-[50px] px-10 bg-[#fff1] flex items-center'>Info</div>
      <AudioPlayerProvider>
        <Header beatmapId={Number(params.beatmapId)} />
        <Similar beatmapId={Number(params.beatmapId)} />
      </AudioPlayerProvider>
    </main>
  );
}
