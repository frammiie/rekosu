'use server';

import type { Beatmap, Beatmapset, Score, User } from 'osu-api-v2-js';
import { Ruleset } from 'osu-api-v2-js';
import { circuit } from '~/utils/handlers';
import { osu } from '../osu';
import { cache } from '../cache';
import { db } from '../db';
import { cosineDistance, desc, ne, eq, inArray, sql } from 'drizzle-orm';
import { beatmaps } from '../../../drizzle/schema';

export type RekosuBeatmap = Beatmap.Extended.WithFailtimesOwners & {
  beatmapset?: Beatmapset;
  similarity?: number;
  maxPp?: number | null;
};

export async function getBeatmap(
  beatmapId: number
): Promise<RekosuBeatmap | null> {
  const cached = await cache.get<RekosuBeatmap | null>(['beatmaps', beatmapId]);
  if (cached) return cached;

  const clients = await osu.getClients();
  const remoteBeatmap = await circuit<RekosuBeatmap | null>(
    osu.perform(clients, client => client.getBeatmap(beatmapId))
  );
  if (!remoteBeatmap) return null;

  const dbBeatmap = (
    await db
      .select({ maxPp: beatmaps.maxPp })
      .from(beatmaps)
      .where(eq(beatmaps.id, beatmapId))
  )[0];
  if (!dbBeatmap) return null;

  remoteBeatmap.maxPp = dbBeatmap.maxPp;

  await cache.set(['beatmaps', beatmapId], remoteBeatmap);

  return remoteBeatmap;
}

export type RekosuBeatmapset = Beatmapset.Extended & {
  beatmaps: RekosuBeatmap[];
  rating: number;
  user: User;
};

export async function getBeatmapset(
  beatmapsetId: number
): Promise<RekosuBeatmapset | null> {
  const cached = await cache.get<RekosuBeatmapset | null>([
    'beatmapsets',
    beatmapsetId,
  ]);
  if (cached) return cached;

  const clients = await osu.getClients();
  const remoteBeatmapset = await circuit<RekosuBeatmapset | null>(
    osu.perform(
      clients,
      client =>
        client.getBeatmapset(
          beatmapsetId
        ) as unknown as Promise<RekosuBeatmapset>
    )
  );
  if (!remoteBeatmapset) return null;

  const databaseBeatmaps = await db
    .select({ id: beatmaps.id, maxPp: beatmaps.maxPp })
    .from(beatmaps)
    .where(
      inArray(
        beatmaps.id,
        remoteBeatmapset.beatmaps.map(beatmap => beatmap.id)
      )
    );
  const databaseBeatmapById = Object.groupBy(
    databaseBeatmaps,
    beatmap => beatmap.id
  );

  remoteBeatmapset.beatmaps = remoteBeatmapset.beatmaps.map(beatmap => ({
    ...beatmap,
    maxPp: databaseBeatmapById[beatmap.id]?.[0].maxPp,
  }));

  await cache.set(['beatmapsets', beatmapsetId], remoteBeatmapset);

  return remoteBeatmapset;
}

export type SimilarBeatmaps = {
  beatmapsets: RekosuBeatmapset[];
};

export async function getSimilarBeatmapsets(
  beatmapId: number,
  limit = 50
): Promise<SimilarBeatmaps | null> {
  const cached = await cache.get<SimilarBeatmaps>([
    'similar_beatmaps',
    beatmapId,
    { limit },
  ]);
  if (cached) return cached;

  const beatmap = (
    await db
      .select({ embeddingR2: beatmaps.embeddingR2 })
      .from(beatmaps)
      .where(eq(beatmaps.id, beatmapId))
  )[0];
  if (!beatmap?.embeddingR2) return null;

  const similarBeatmaps = await db
    .select({
      id: beatmaps.id,
      similarity: sql<number>`1 - (${cosineDistance(beatmaps.embeddingR2, beatmap.embeddingR2)})`,
    })
    .from(beatmaps)
    .where(ne(beatmaps.id, beatmapId))
    .orderBy(beatmap => desc(beatmap.similarity))
    .limit(limit);

  const beatmapById = Object.groupBy(similarBeatmaps, beatmap => beatmap.id);

  const clients = await osu.getClients();
  const remoteBeatmaps = await circuit<RekosuBeatmap[] | null>(
    osu.perform(clients, client =>
      client.getBeatmaps(similarBeatmaps.map(beatmap => beatmap.id))
    )
  );
  if (!remoteBeatmaps) return null;

  const databaseBeatmaps = await db
    .select({ id: beatmaps.id, maxPp: beatmaps.maxPp })
    .from(beatmaps)
    .where(
      inArray(
        beatmaps.id,
        remoteBeatmaps.map(beatmap => beatmap.id)
      )
    );

  const databaseBeatmapById = Object.groupBy(
    databaseBeatmaps,
    beatmap => beatmap.id
  );

  const results = remoteBeatmaps
    .map(beatmap => ({
      ...beatmap,
      maxPp: databaseBeatmapById[beatmap.id]?.[0].maxPp,
      similarity: beatmapById[beatmap.id]?.[0].similarity ?? 0,
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .reduce((beatmapsets, beatmap) => {
      const beatmapset =
        beatmapsets.get(beatmap.beatmapset_id) ??
        ({
          ...beatmap.beatmapset,
          beatmaps: [],
        } as unknown as RekosuBeatmapset);

      beatmapset.beatmaps.push(beatmap);

      if (beatmapset.beatmaps.length == 1) {
        beatmapsets.set(beatmap.beatmapset_id, beatmapset);
      }

      return beatmapsets;
    }, new Map<number, RekosuBeatmapset>());

  const result = {
    beatmapsets: Array.from(results.values()),
  };

  await cache.set(['similar_beatmaps', beatmapId, { limit }], result);

  return result;
}

export type RekosuUser = User.Extended;

export async function getUser(userId: number) {
  const cached = await cache.get<RekosuUser>(['user', userId]);
  if (cached) return cached;

  const clients = await osu.getClients();
  const user = await circuit(
    osu.perform(clients, client => client.getUser(userId))
  );
  if (!user) return null;

  cache.set(['user', userId], user);

  return user;
}

export type RekosuUserScore = Score.WithUserBeatmapBeatmapset;

export async function getUserScores(
  userId: number,
  type: 'best' | 'firsts' | 'recent',
  mode?: keyof typeof Ruleset
): Promise<RekosuUserScore[] | null> {
  const clients = await osu.getClients();
  const remoteScores = await circuit(
    osu.perform(clients, client =>
      client.getUserScores(
        userId,
        type,
        mode != null ? Ruleset[mode] : undefined,
        undefined,
        {
          limit: 50,
        }
      )
    )
  );
  if (!remoteScores) return null;

  const scoreCompareFn =
    type === 'recent'
      ? (a: RekosuUserScore, b: RekosuUserScore) =>
          b.ended_at.getTime() - a.ended_at.getTime()
      : (a: RekosuUserScore, b: RekosuUserScore) => (b.pp ?? 0) - (a.pp ?? 0);

  const scoresByBeatmapId = Object.groupBy(remoteScores, score =>
    String(score.beatmap.id)
  );

  const scores = Object.keys(scoresByBeatmapId)
    .map(beatmapId => scoresByBeatmapId[beatmapId]!.sort(scoreCompareFn)[0])
    .sort(scoreCompareFn);

  return scores;
}
