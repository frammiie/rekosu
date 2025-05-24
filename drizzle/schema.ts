import { pgSchema, bigint, vector } from 'drizzle-orm/pg-core';

export const trained = pgSchema('trained');

export const beatmaps = trained.table('beatmaps', {
  id: bigint({ mode: 'number' }).primaryKey().notNull(),
  embedding: vector({ dimensions: 768 }),
  embeddingBegin: vector('embedding_begin', { dimensions: 768 }),
  embeddingMiddle: vector('embedding_middle', { dimensions: 768 }),
  embeddingEnd: vector('embedding_end', { dimensions: 768 }),
  embeddingFull: vector('embedding_full', { dimensions: 768 }),
  embeddingR2: vector('embedding_r2', { dimensions: 768 }),
});
