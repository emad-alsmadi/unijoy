
import EventDetailsClient from './EventDetailsClient';
import { headers } from 'next/headers';
import { get } from '@/lib/api/base';

export default async function EventDetailsPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  let initialEvent: any = null;
  try {
    const cookieHeader = ((headers() as unknown) as any)?.get?.('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1];
    const res = await get<{ event: any }>(`/events/${eventId}`, { token });
    initialEvent = res?.event || null;
  } catch {}

  return <EventDetailsClient initialEvent={initialEvent} eventId={eventId} />;
}
