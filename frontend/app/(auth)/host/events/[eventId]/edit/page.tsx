import { headers } from 'next/headers';
import { get } from '@/lib/api/base';
import EventEditForm from '@/components/events/EventEditForm';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  let initialEvent: any = null;
  try {
    const cookieHeader = (headers() as unknown as any)?.get?.('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith('token='))
      ?.split('=')[1];
    if (eventId) {
      const res = await get<{ event: any }>(`/events/${eventId}`, { token });
      initialEvent = res?.event || null;
    }
  } catch {}

  return (
    <EventEditForm
      initialEvent={initialEvent}
      eventId={eventId}
    />
  );
}
