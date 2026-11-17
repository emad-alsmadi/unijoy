'use client';
import dynamic from 'next/dynamic';
import { EventCategory } from '@/types';

const EventEditForm = dynamic(
  () => import('@/components/events/EventEditForm'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function EventEditClient({
  initialEvent,
  eventId,
}: {
  initialEvent: EventCategory;
  eventId: string;
}) {
  return (
    <EventEditForm
      initialEvent={initialEvent}
      eventId={eventId}
    />
  );
}
