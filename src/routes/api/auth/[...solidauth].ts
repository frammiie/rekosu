import type { APIEvent } from '@solidjs/start/server';
import { handleAuth } from '~/server/auth';

export const GET = (event: APIEvent) => handleAuth(event.request);
export const POST = GET;
