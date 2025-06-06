'use server';

import type { Beatmapset } from 'osu-api-v2-js';
import { cache } from './cache';

export async function trackRecentBeatmapset(beatmapsetId: number) {
  const beatmapset = await cache.get<Beatmapset.Extended.Plus>([
    'beatmapsets',
    beatmapsetId,
  ]);
  if (!beatmapset) return;

  let recentBeatmapsets =
    (await cache.get<Beatmapset.Extended.Plus[]>(['recent_beatmapsets'])) ?? [];

  recentBeatmapsets = recentBeatmapsets.filter(
    rbms => rbms.id !== beatmapset.id
  );
  recentBeatmapsets.unshift(beatmapset);
  recentBeatmapsets = recentBeatmapsets.slice(0, 16);

  await cache.set(['recent_beatmapsets'], recentBeatmapsets, {
    expiration: null,
  });
}
