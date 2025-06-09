'use server';

import { cache } from './cache';
import { notFound } from '~/utils/errors';
import * as data from './data';
import type { Ruleset } from 'osu-api-v2-js';

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

export async function getSimilarBeatmapsets(beatmapId: number, limit = 50) {
  const similarBeatmaps = await data.getSimilarBeatmapsets(beatmapId, limit);
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

export type UserQuery = {
  user: data.RekosuUser;
};

export async function getUser(userId: number) {
  const user = await data.getUser(userId);

  if (!user) {
    return notFound('Failed to find user...');
  }

  return { user };
}

export type UserScoresQuery = {
  scores: data.RekosuUserScore[];
};

export async function getUserScores(
  userId: number,
  type: 'best' | 'firsts' | 'recent',
  mode: keyof typeof Ruleset
) {
  const scores = await data.getUserScores(userId, type, mode);

  if (!scores) {
    return notFound('Failed to find scores...');
  }

  return { scores };
}
