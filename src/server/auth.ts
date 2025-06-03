import { type SolidAuthConfig } from '@solid-mediakit/auth';
import Osu from '@auth/core/providers/osu';
import { serverEnv } from '~/env/server';
import { circuit } from '~/utils/handlers';
import { cache } from './cache';

export const authOptions: SolidAuthConfig = {
  providers: [
    Osu({
      clientId: String(serverEnv.AUTH_OSU_ID),
      clientSecret: serverEnv.AUTH_OSU_SECRET,
      authorization: 'https://osu.ppy.sh/oauth/authorize?scope=identify+public',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.osu.id;
      session.osu = {
        id: token.osu.id,
        accessToken: token.osu.access_token,
      };
      session.error = token.error;

      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        // First time login
        token.osu = {
          id: account.providerAccountId,
          access_token: account.access_token!,
          refresh_token: account.refresh_token!,
          expires_at: account.expires_at!,
        };

        await cache.remove(['session_valid', token.osu.id]);
      } else if (Date.now() < token.osu.expires_at * 1000) {
        // Check if session still valid
        const validSession = await circuit([
          () => cache.get(['session_valid', token.osu.id]),
          async () => {
            const response = await fetch(
              'https://osu.ppy.sh/api/v2/session/verify',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'User-Agent': 'Rekosu',
                  Authorization: 'Bearer ' + token.osu.access_token,
                },
              }
            );

            return response.ok;
          },
        ]);

        if (!validSession) {
          token.error = 'InvalidSessionError';

          await cache.set(['session_valid', token.osu.id], false);
        }

        await cache.set(['session_valid', token.osu.id], validSession, {
          expiration: 60,
        });

        return token;
      } else {
        // Token about to/expired, need to refresh token
        try {
          const response = await fetch('https://osu.ppy.sh/oauth/token', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Rekosu',
            },
            body: JSON.stringify({
              client_id: String(serverEnv.AUTH_OSU_ID),
              client_secret: serverEnv.AUTH_OSU_SECRET,
              grant_type: 'refresh_token',
              refresh_token: token.osu.refresh_token,
            }),
          });

          const content = await response.json();

          if (content.error) {
            throw new Error(JSON.stringify(content));
          }

          token.osu = {
            ...token.osu,
            access_token: content?.access_token,
            refresh_token: content?.refresh_token,
            expires_at: content?.expires_at,
          };
        } catch (error) {
          console.error(`Failed to refresh token for ${token.osu.id}`, error);

          token.error = 'RefreshTokenError';

          await cache.set(['session_valid', token.osu.id], false);
        }
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      // Explicit origin due to proxy
      const activeBaseUrl = serverEnv.AUTH_ORIGIN ?? baseUrl;

      if (new URL(url).origin === new URL(activeBaseUrl).origin) {
        return url;
      }

      return activeBaseUrl;
    },
  },
  basePath: '/api/auth',
  trustHost: serverEnv.AUTH_TRUST_HOST === 'true',
  secret: serverEnv.AUTH_OSU_SECRET,
};

declare module '@auth/core/types' {
  export interface Session {
    user?: DefaultSession['user'];
    osu: {
      id: string;
      accessToken: string;
    };
    error?: string;
  }
}

declare module '@auth/core/jwt' {
  export interface JWT {
    osu: {
      id: string;
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
    error?: string;
  }
}
