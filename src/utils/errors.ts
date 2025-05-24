import { CustomResponse, json } from '@solidjs/router';

export type ErrorResponse = {
  error: {
    code: 'NOTFOUND';
    message: string;
  };
};

export function isError(response: any): response is ErrorResponse {
  return !!response?.error;
}

export function notFound(message: string): CustomResponse<ErrorResponse> {
  return json({ error: { code: 'NOTFOUND', message } }, { status: 404 });
}
