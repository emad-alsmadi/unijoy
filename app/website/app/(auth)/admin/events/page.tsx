import AdminEventsClient from './AdminEventsClient';
import { get } from '@/lib/api/base';
import { headers } from 'next/headers';

export default async function AllEventsPage() {
  const initialPage = 1;
  const perPage = 6;
  const cookieHeader = (headers() as unknown as any)?.get?.('cookie') || '';
  const initialToken =
    cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1] || '';
  let initial = { events: [], totalPages: 0, totalItems: 0 } as any;
  try {
    if (initialToken) {
      initial = await get<{
        events: any[];
        totalPages: number;
        totalItems: number;
      }>(`/admin/events?page=${initialPage}&perPage=${perPage}`, {
        token: initialToken,
      });
    }
  } catch {}

  return (
    <AdminEventsClient
      initialEvents={initial?.events || []}
      initialTotalPages={initial?.totalPages || 0}
      initialTotalItems={initial?.totalItems || 0}
      initialPage={initialPage}
      perPage={perPage}
      initialToken={initialToken}
    />
  );
}
