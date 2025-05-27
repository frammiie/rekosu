'use server';

import { db } from './db';
import { beatmaps } from '../../drizzle/schema';
import { cosineDistance, desc, eq, ne, sql } from 'drizzle-orm';
import { cache } from './cache';
import { osu } from './osu';
import type { Beatmap, Beatmapset } from 'osu-api-v2-js';
import { circuit } from '~/utils/handlers';
import { notFound } from '~/utils/errors';

export type BeatmapDetails = {
  beatmap: Beatmap.Extended;
  beatmapset: Beatmapset.Extended.Plus & { rating: number };
};

export async function getBeatmap(beatmapId: number) {
  const clients = await osu.getClients();

  let beatmap: Beatmap | null = null;
  beatmap = await circuit<Beatmap | null>([
    () => cache.get(['beatmaps', beatmapId]),
    ...osu.perform(clients, client => client.getBeatmap(beatmapId)),
  ]);
  await cache.set(['beatmaps', beatmapId], beatmap);

  if (!beatmap) {
    return notFound('Failed to find beatmap...');
  }

  const beatmapset = await circuit<Beatmapset | null>([
    () => cache.get(['beatmapsets', beatmap.beatmapset_id]),
    ...osu.perform(clients, client =>
      client.getBeatmapset(beatmap.beatmapset_id)
    ),
  ]);
  await cache.set(['beatmapsets', beatmap.beatmapset_id], beatmapset);

  if (!beatmap) {
    return notFound('Failed to find beatmapset...');
  }

  return { beatmap, beatmapset } as BeatmapDetails;
}

export type SimilarBeatmaps = {
  beatmapsets: (Beatmapset.Extended.WithBeatmap & {
    beatmaps: (Beatmap & { similarity: number })[];
  })[];
};

export async function getSimilarBeatmapsets(beatmapId: number) {
  const cached = await cache.get<SimilarBeatmaps>([
    'similar_beatmaps',
    beatmapId,
  ]);
  if (cached) return cached;

  const beatmap = (
    await db
      .select({ embeddingR2: beatmaps.embeddingR2 })
      .from(beatmaps)
      .where(eq(beatmaps.id, beatmapId))
  )[0];

  if (!beatmap?.embeddingR2) {
    return notFound('Failed to find beatmap...');
  }

  const similarBeatmaps = await db
    .select({
      id: beatmaps.id,
      similarity: sql<number>`1 - (${cosineDistance(beatmaps.embeddingR2, beatmap.embeddingR2)})`,
    })
    .from(beatmaps)
    .where(ne(beatmaps.id, beatmapId))
    .orderBy(beatmap => desc(beatmap.similarity))
    .limit(50);

  const beatmapById = Object.groupBy(similarBeatmaps, beatmap => beatmap.id);

  const clients = await osu.getClients();

  const fetchedBeatmaps = await circuit<Beatmap.WithBeatmapset[] | null>(
    osu.perform(
      clients,
      client =>
        client.getBeatmaps(
          similarBeatmaps.map(beatmap => beatmap.id)
        ) as unknown as Promise<Beatmap.WithBeatmapset[] | null>
    )
  );

  if (!fetchedBeatmaps) {
    return notFound('Failed to find beatmaps...');
  }

  const results = fetchedBeatmaps
    .map(beatmap => ({
      ...beatmap,
      similarity: beatmapById[beatmap.id]?.[0].similarity ?? 0,
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .reduce((beatmapsets, beatmap) => {
      const beatmapset =
        beatmapsets.get(beatmap.beatmapset_id) ??
        ({
          ...beatmap.beatmapset,
          beatmaps: [],
        } as unknown as SimilarBeatmaps['beatmapsets'][0]);

      beatmapset.beatmaps.push(beatmap);

      if (beatmapset.beatmaps.length == 1) {
        beatmapsets.set(beatmap.beatmapset_id, beatmapset);
      }

      return beatmapsets;
    }, new Map<number, SimilarBeatmaps['beatmapsets'][0]>());

  const result = {
    beatmapsets: Array.from(results.values()),
  };

  await cache.set(['similar_beatmaps', beatmapId], result);

  return result as SimilarBeatmaps;
}
