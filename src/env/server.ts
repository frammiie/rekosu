import { z } from 'zod';
import { serverScheme } from './schema';

const env = serverScheme.safeParse(process.env);

if (env.success === false) {
  console.error(
    '❌ Invalid environment variables:\n',
    z.prettifyError(env.error)
  );
  throw new Error('Invalid environment variables');
}

export const serverEnv = env.data;
