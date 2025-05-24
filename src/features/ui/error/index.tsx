import { useAuth } from '@solid-mediakit/auth/client';
import { A } from '@solidjs/router';
import { Show } from 'solid-js';
import { isError } from '~/utils/errors';

export type ErrorProps = {
  response: any;
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
              <A href='#' class='underline' onClick={() => auth.signIn('osu')}>
                logging in
              </A>{' '}
              to sidestep the global ratelimit.
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
