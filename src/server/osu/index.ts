import { getSession } from '@solid-mediakit/auth';
import { API, APIError } from 'osu-api-v2-js';
import { getRequestEvent } from 'solid-js/web';
import { serverEnv } from '~/env/server';
import { authOptions } from '../auth';
import { cache } from '../cache';

let client: API | null = null;

async function getClients() {
  const expiresSoon = client
    ? client.expires.getTime() - Date.now() < 60 * 60 * 1000
    : false;

  if (!client || expiresSoon) {
    client = await API.createAsync(
      serverEnv.AUTH_OSU_ID,
      serverEnv.AUTH_OSU_SECRET
    );
  }

  let userClient: API | null = null;
  const requestEvent = getRequestEvent();
  if (requestEvent) {
    const session = await getSession(requestEvent, authOptions);

    if (session && session.osu.accessToken && !session.error) {
      userClient = new API({
        access_token: session.osu.accessToken,
      });
    }
  }

  if (userClient) {
    return [userClient, client];
  }

  return [client];
}

function perform<TResult>(
  clients: API[],
  action: (client: API) => Promise<TResult>
) {
  return clients.map(client => {
    return async function perform() {
      try {
        return await action(client);
      } catch (error) {
        console.error(error);

        if (
          error! instanceof APIError ||
          (error as APIError).status_code !== 401
        )
          return null;

        // Handle 401 by marking session as invalid
        const requestEvent = getRequestEvent();
        if (!requestEvent) return null;

        const session = await getSession(requestEvent, authOptions);
        if (!session) return null;

        await cache.set(['session_valid', session.osu.id], false);

        return null;
      }
    };
  });
}

export const osu = {
  getClients,
  perform,
};
