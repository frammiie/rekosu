import { intervalToDuration } from 'date-fns';
import { format } from 'date-fns';

export function formatDuration(seconds: number): string {
  const startDate = new Date(0);
  const endDate = new Date(seconds * 1000);

  const duration = intervalToDuration({ start: startDate, end: endDate });

  const hours = duration.hours || 0;
  const minutes = String(duration.minutes || 0).padStart(2, '0');
  const remainingSeconds = String(duration.seconds || 0).padStart(2, '0');

  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${minutes}:${remainingSeconds}`
    : `${minutes}:${remainingSeconds}`;
}

export function formatDate(date: Date | string) {
  return format(date instanceof Date ? date : new Date(date), 'd LLL y');
}

export function formatDateTime(date: Date | string) {
  return format(date instanceof Date ? date : new Date(date), 'd LLL y HH:mm');
}
