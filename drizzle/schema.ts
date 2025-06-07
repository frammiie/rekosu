import { pgSchema, index, bigint, vector, real } from 'drizzle-orm/pg-core';

export const trained = pgSchema('trained');

export const beatmaps = trained.table(
  'beatmaps',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().notNull(),
    embedding: vector({ dimensions: 768 }),
    embeddingBegin: vector('embedding_begin', { dimensions: 768 }),
    embeddingMiddle: vector('embedding_middle', { dimensions: 768 }),
    embeddingEnd: vector('embedding_end', { dimensions: 768 }),
    embeddingFull: vector('embedding_full', { dimensions: 768 }),
    embeddingR2: vector('embedding_r2', { dimensions: 768 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    beatmapsetId: bigint('beatmapset_id', { mode: 'number' }),
    maxPp: real('max_pp'),
  },
  table => [
    index('beatmaps_beatmapset_id').using(
      'hash',
      table.beatmapsetId.asc().nullsLast().op('int8_ops')
    ),
  ]
);
