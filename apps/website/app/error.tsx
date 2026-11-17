'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-16'>
      <div className='w-full max-w-lg rounded-2xl border border-black/10 bg-white p-6 shadow-sm'>
        <h1 className='text-2xl font-semibold text-gray-900'>Something went wrong</h1>
        <p className='mt-2 text-sm text-gray-600'>
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className='mt-6 flex flex-wrap gap-3'>
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant='outline' asChild>
            <Link href='/'>Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
