'use client';
import { useState } from 'react';
import EventDetails from '@/components/ui/eventDetials';
import { useAuth } from '@/context/AuthContext';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { get } from '@/lib/api/base';
import { EventCategory } from '@/types';
import NotFound from '@/components/ui/NotFound';
import { Loading } from '@/components/ui/Loading';
import { useToast } from '@/hooks/use-toast';

export default function EventDetailsClient({ initialEvent, eventId }: { initialEvent: EventCategory | null; eventId: string; }) {
  const { token, userRole } = useAuth();
  const [event, setEvent] = useState<EventCategory | null>(initialEvent);
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['event', 'public', eventId],
    queryFn: async () => {
      const res = await get<{ event: EventCategory }>(`/events/${eventId}`, {
        token,
        onError: (err) =>
          toast({ title: 'Error', description: err.message, variant: 'destructive' }),
      });
      return res.event;
    },
    enabled: !!token && !!eventId,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
    initialData: initialEvent || undefined,
  });

  if (!event && data) setEvent(data);

  if (isLoading && !event) return <Loading />;
  if (isError) return <NotFound message={(error as Error)?.message || 'Error'} />;

  return event ? <EventDetails event={event} userRole={userRole} /> : <NotFound message='Event not found' />;
}
