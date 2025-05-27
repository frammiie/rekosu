import { Redis } from 'ioredis';
import { serverEnv } from '~/env/server';

export const redis = new Redis({
  host: serverEnv.REDIS_HOST,
});

function joinCompositeKey(key: unknown[]) {
  return key.join('_');
}

async function get<TResult>(key: unknown[]): Promise<TResult | null> {
  const compositeKey = joinCompositeKey(key);

  const cached = await redis.get(compositeKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  return null;
}

async function set<TValue>(
  key: unknown[],
  value: TValue,
  options?: { expiration?: number }
) {
  const compositeKey = joinCompositeKey(key);

  const pipeline = redis.pipeline();

  pipeline.set(joinCompositeKey(key), JSON.stringify(value));
  pipeline.expire(compositeKey, options?.expiration ?? 24 * 60 * 60);

  await pipeline.exec();
}

async function remove(key: unknown[]) {
  await redis.del(joinCompositeKey(key));
}

export const cache = {
  get,
  set,
  remove,
};
