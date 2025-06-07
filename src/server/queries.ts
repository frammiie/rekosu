'use server';

import { cache } from './cache';
import { notFound } from '~/utils/errors';
import * as data from './data';

export type BeatmapDetailsQuery = {
  beatmap: data.RekosuBeatmap;
  beatmapset: data.RekosuBeatmapset;
};

export async function getBeatmap(beatmapId: number) {
  const beatmap = await data.getBeatmap(beatmapId);

  if (!beatmap) {
    return notFound('Failed to find beatmap...');
  }

  const beatmapset = await data.getBeatmapset(beatmap.beatmapset_id);

  if (!beatmapset) {
    return notFound('Failed to find beatmapset...');
  }

  return { beatmap, beatmapset };
}

export type SimilarBeatmapsQuery = {
  beatmapsets: data.RekosuBeatmapset[];
};

export async function getSimilarBeatmapsets(beatmapId: number) {
  const similarBeatmaps = await data.getSimilarBeatmapsets(beatmapId);
  if (!similarBeatmaps) {
    return notFound('Failed to find similar beatmaps...');
  }

  return similarBeatmaps;
}

export type RecentBeatmapsetsQuery = {
  beatmapsets: data.RekosuBeatmapset[];
};

export async function getRecentBeatmapsets() {
  const beatmapsets =
    (await cache.get<data.RekosuBeatmapset[]>(['recent_beatmapsets'])) ?? [];

  return { beatmapsets };
}
