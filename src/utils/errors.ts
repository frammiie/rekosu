import type { CustomResponse } from '@solidjs/router';
import { json } from '@solidjs/router';

export type ErrorResponse = {
  error: {
    code: 'ENOTFOUND';
    message: string;
  };
};

export function isError(
  response: Record<string, unknown>
): response is ErrorResponse {
  return !!response?.error;
}

export function notFound(message: string): CustomResponse<ErrorResponse> {
  return json({ error: { code: 'ENOTFOUND', message } }, { status: 404 });
}
