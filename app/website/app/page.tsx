import EventHome from '@/components/home/Home';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';

export default async function Home() {
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('token='))
    ?.split('=')[1];

  let initialUpcomingEvents: any[] = [];
  try {
    const res = await get<{ events: any[] }>(`/events`, { token });
    initialUpcomingEvents = res?.events || [];
  } catch {
    initialUpcomingEvents = [];
  }

  return (
    <div>
      <EventHome initialUpcomingEvents={initialUpcomingEvents} />
    </div>
  );
}
