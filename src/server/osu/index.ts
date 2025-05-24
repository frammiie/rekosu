import { getSession, useAuth } from '@solid-mediakit/auth/client';
import { API } from 'osu-api-v2-js';
import { getRequestEvent } from 'solid-js/web';
import { serverEnv } from '~/env/server';

let client: API | null = null;

async function getClients() {
  if (!client) {
    client = await API.createAsync(
      serverEnv.AUTH_OSU_ID,
      serverEnv.AUTH_OSU_SECRET
    );
  }

  const session = await getSession(getRequestEvent());

  let userClient: API | null = null;

  if (session?.osu.accessToken) {
    userClient = new API({
      access_token: session.osu.accessToken,
    });
  }

  if (userClient) {
    return [userClient, client];
  }

  return [client];
}

export const osu = {
  getClients,
};
