import type { Session } from '@auth/core/types';
import { createAsync } from '@solidjs/router';
import type { ParentProps } from 'solid-js';
import { createContext, useContext } from 'solid-js';
import { getSession } from '~/server';

const basePath = '/api/auth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  session: () => Session | null | undefined;
  status: () => AuthStatus;
};

const AuthContext = createContext<AuthContextValue>();

export function SessionProvider(props: ParentProps) {
  const session = createAsync(() => getSession(), { deferStream: true });

  const status = (): AuthStatus => {
    const value = session();
    if (value === undefined) return 'loading';
    return value ? 'authenticated' : 'unauthenticated';
  };

  return (
    <AuthContext.Provider value={{ session, status }}>
      {props.children}
    </AuthContext.Provider>
  );
}

async function getCsrfToken() {
  const response = await fetch(`${basePath}/csrf`);
  const { csrfToken } = await response.json();

  return csrfToken as string;
}

async function postAuthAction(path: string, callbackUrl: string) {
  const response = await fetch(`${basePath}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    body: new URLSearchParams({
      csrfToken: await getCsrfToken(),
      callbackUrl,
    }),
  });
  const { url } = await response.json();

  const target = url ?? callbackUrl;
  window.location.href = target;
  // Browsers don't reload when only the hash changes
  if (target.includes('#')) window.location.reload();
}

export function signIn(providerId: string) {
  return postAuthAction(`signin/${providerId}`, window.location.href);
}

export function signOut() {
  return postAuthAction('signout', window.location.href);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('`useAuth` must be used within a <SessionProvider />');
  }

  return { ...context, signIn, signOut };
}
