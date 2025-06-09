import { Redis } from 'ioredis';
import { serverEnv } from '~/env/server';

export const redis = new Redis({
  host: serverEnv.REDIS_HOST,
});

function joinCompositeKey(key: unknown[]) {
  return key
    .map(k => (typeof k === 'object' ? JSON.stringify(k) : k))
    .join('_');
}

async function get<TResult>(key: unknown[]): Promise<TResult | null> {
  const compositeKey = joinCompositeKey(key);

  const cached = await redis.get(compositeKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.error(error);
    }
  }

  return null;
}

async function set<TValue>(
  key: unknown[],
  value: TValue,
  options?: { expiration?: number | null }
) {
  const compositeKey = joinCompositeKey(key);

  const pipeline = redis.pipeline();

  pipeline.set(joinCompositeKey(key), JSON.stringify(value));
  if (options?.expiration !== null) {
    pipeline.expire(compositeKey, options?.expiration ?? 24 * 60 * 60);
  } else {
    pipeline.persist(compositeKey);
  }

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
