import { type SolidAuthConfig } from '@solid-mediakit/auth';
import Osu from '@auth/core/providers/osu';
import { serverEnv } from '~/env/server';

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
      } else if (Date.now() < token.osu.expires_at * 1000) {
        // Access token still valid
        return token;
      } else {
        // Need to refresh token
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

          token.osu = {
            ...token.osu,
            access_token: content?.access_token,
            refresh_token: content?.refresh_token,
            expires_at: content?.expires_at,
          };
        } catch {
          console.error(`Failed to refresh token for ${token.osu.id}`);

          token.error = 'RefreshTokenError';
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
