import EventsClient from './EventsClient';
import { get } from '@/lib/api/base';
import { headers } from 'next/headers';

export default async function AllEventsPage() {
  const initialPage = 1;
  const perPage = 6;
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith('token='))
    ?.split('=')[1];
  const data = await get<{
    events: any[];
    totalPages: number;
    totalItems: number;
  }>(`/events?page=${initialPage}&perPage=${perPage}`, { token });

  return (
    <EventsClient
      initialEvents={data?.events || []}
      initialTotalPages={data?.totalPages || 0}
      initialTotalItems={data?.totalItems || 0}
      initialPage={initialPage}
      perPage={perPage}
    />
  );
}
