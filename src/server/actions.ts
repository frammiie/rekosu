'use server';

import { cache } from './cache';
import type { RekosuBeatmapset } from './data';

export async function trackRecentBeatmapset(beatmapsetId: number) {
  const beatmapset = await cache.get<RekosuBeatmapset>([
    'beatmapsets',
    beatmapsetId,
  ]);
  if (!beatmapset) return;

  let recentBeatmapsets =
    (await cache.get<RekosuBeatmapset[]>(['recent_beatmapsets'])) ?? [];

  recentBeatmapsets = recentBeatmapsets.filter(
    rbms => rbms.id !== beatmapset.id
  );
  recentBeatmapsets.unshift(beatmapset);
  recentBeatmapsets = recentBeatmapsets.slice(0, 16);

  await cache.set(['recent_beatmapsets'], recentBeatmapsets, {
    expiration: null,
  });
}
