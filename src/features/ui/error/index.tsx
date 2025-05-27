import { useAuth } from '@solid-mediakit/auth/client';
import { A } from '@solidjs/router';
import { Show } from 'solid-js';
import { isError, type ErrorResponse } from '~/utils/errors';
import { Link } from '../link';

export type ErrorProps = {
  response: ErrorResponse;
};

export function Error(props: ErrorProps) {
  const auth = useAuth();

  return (
    <div class='w-full h-full flex flex-col items-center justify-center my-auto'>
      <div class='text-[#fff8]'>
        <Show
          when={isError(props.response)}
          fallback='An unexpected error occurred'
        >
          {props.response.error.message}
        </Show>
      </div>
      <div class='text-[#fff6]'>
        <div>Maybe try checking if the URL is valid or try again later.</div>
        <Show when={auth.status() === 'unauthenticated'}>
          <div class='text-xs flex flex-col items-center mt-2'>
            <div>Getting many errors?</div>
            <div>
              Maybe try{' '}
              <Link href='#' onClick={() => auth.signIn('osu')}>
                logging in
              </Link>{' '}
              to sidestep the global ratelimit.
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
