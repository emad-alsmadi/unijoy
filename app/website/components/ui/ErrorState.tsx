'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  error?: unknown;
  title?: string;
  onRetry?: () => void;
  homeHref?: string;
};

function getStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const anyErr = err as any;
  const status = anyErr.status ?? anyErr.statusCode;
  return typeof status === 'number' ? status : undefined;
}

function getMessage(err: unknown): string | undefined {
  if (!err) return undefined;
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && (err as any).message) return String((err as any).message);
  return undefined;
}

export default function ErrorState({
  error,
  title = 'Something went wrong',
  onRetry,
  homeHref = '/',
}: Props) {
  const status = getStatus(error);
  const message = getMessage(error);

  let subtitle = message || 'Please try again.';

  if (status === 0) subtitle = 'Network error. Please check your connection and try again.';
  if (status === 401) subtitle = 'Your session is not valid. Please log in again.';
  if (status === 403) subtitle = 'You do not have permission to access this page.';
  if (status === 404) subtitle = 'The requested resource was not found.';
  if (typeof status === 'number' && status >= 500)
    subtitle = 'Server error. Please try again in a moment.';

  return (
    <div className='w-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
          <p className='mt-1 text-sm text-gray-600'>{subtitle}</p>
        </div>
        {typeof status === 'number' && status > 0 ? (
          <div className='text-xs font-medium text-gray-500'>HTTP {status}</div>
        ) : null}
      </div>
      <div className='mt-5 flex flex-wrap gap-3'>
        {onRetry ? <Button onClick={onRetry}>Retry</Button> : null}
        <Button variant='outline' asChild>
          <Link href={homeHref}>Back</Link>
        </Button>
        {status === 401 ? (
          <Button asChild>
            <Link href='/auth/login'>Login</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
