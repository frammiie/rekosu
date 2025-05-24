import { z } from 'zod';

export const serverScheme = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  AUTH_OSU_ID: z.coerce.number(),
  AUTH_OSU_SECRET: z.string(),
  AUTH_SECRET: z.string(),
  AUTH_TRUST_HOST: z.string().optional(),
  AUTH_URL: z.string().optional(),
  AUTH_ORIGIN: z.string().optional(),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string(),
});

export const clientScheme = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});
