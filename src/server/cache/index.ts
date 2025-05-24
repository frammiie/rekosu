import { Redis } from 'ioredis';
import { serverEnv } from '~/env/server';

export const redis = new Redis({
  host: serverEnv.REDIS_HOST,
});

function joinCompositeKey(key: any[]) {
  return key.join('_');
}

async function get<TResult>(key: any[]): Promise<TResult | null> {
  const compositeKey = joinCompositeKey(key);

  const cached = await redis.get(compositeKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  return null;
}

async function set<TValue>(key: any[], value: TValue) {
  const compositeKey = joinCompositeKey(key);

  const pipeline = redis.pipeline();

  pipeline.set(joinCompositeKey(key), JSON.stringify(value));
  pipeline.expire(compositeKey, 24 * 60 * 60);

  await pipeline.exec();
}

export const cache = {
  get,
  set,
};
