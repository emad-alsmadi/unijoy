import UserEventsClient from './UserEventsClient';
import { get } from '@/lib/api/base';
import { headers } from 'next/headers';

export default async function UserEventsPage() {
  const initialPage = 1;
  const perPage = 6;
  let initial = { events: [], totalPages: 0, totalItems: 0 } as any;
  try {
    const cookieHeader = ((headers() as unknown) as any)?.get?.('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1];
    if (token) {
      initial = await get<{ events: any[]; totalPages: number; totalItems: number }>(
        `/users/me/registered-events?page=${initialPage}&perPage=${perPage}`,
        { token }
      );
    }
  } catch {}

  return (
    <UserEventsClient
      initialEvents={initial?.events || []}
      initialTotalPages={initial?.totalPages || 0}
      initialTotalItems={initial?.totalItems || 0}
      initialPage={initialPage}
      perPage={perPage}
    />
  );
}