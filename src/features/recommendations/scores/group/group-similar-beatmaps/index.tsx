import { createVisibilityObserver } from '@solid-primitives/intersection-observer';
import { createEffect, createResource, createSignal, For } from 'solid-js';
import { Card } from '~/features/recommendations/beatmapsets/grid/card';
import { getSimilarBeatmapsets } from '~/server';
import type { RekosuUserScore } from '~/server/data';
import type { SimilarBeatmapsQuery } from '~/server/queries';

export type GroupSimilarBeatmaps = {
  score: RekosuUserScore;
  initialIndex?: number;
};

export function GroupSimilarBeatmaps(props: GroupSimilarBeatmaps) {
  let containerRef: HTMLDivElement | undefined;

  const visible = createVisibilityObserver({
    initialValue: false,
  })(() => containerRef);

  const [enabled, setEnabled] = createSignal(
    props.initialIndex != null ? props.initialIndex < 3 : true
  );

  createEffect(() => {
    if (enabled() || !visible()) return;

    setEnabled(true);
  });

  const [similarBeatmaps] = createResource<
    SimilarBeatmapsQuery | null,
    number | null
  >(
    () => (enabled() ? props.score.beatmap.id : null),
    (beatmapId: number | null) => {
      if (!beatmapId) return null;

      return getSimilarBeatmapsets(
        beatmapId,
        25
      ) as Promise<SimilarBeatmapsQuery | null>;
    }
  );

  return (
    <div
      ref={containerRef}
      class='md:px-10 px-5 py-5 grid md:grid-cols-2 grid-cols-1 gap-[10px] w-full'
    >
      <For each={similarBeatmaps()?.beatmapsets.slice(0, 6)}>
        {beatmapset => <Card beatmapset={beatmapset} />}
      </For>
    </div>
  );
}
