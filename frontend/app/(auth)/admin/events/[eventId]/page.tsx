'use client';
import { useParams } from 'next/navigation';
import EventDetails from '@/components/ui/eventDetials';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { EventCategory } from '@/types';
import NotFound from '@/components/ui/NotFound';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/Loading';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/base';

const EventDetailsPage = () => {
  const params = useParams();
  const { toast } = useToast();
  const { token, userRole } = useAuth();
  const [event, setEvent] = useState<EventCategory | null>(null);

  const eventId = params.eventId as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['event', 'admin', eventId],
    queryFn: async () => {
      const res = await get<{ event: EventCategory }>(`/admin/events/${eventId}`, {
        token,
        onError: (err) =>
          toast({
            title: 'Error',
            description: err.message,
            variant: 'destructive',
          }),
      });
      return res.event;
    },
    enabled: !!token && !!eventId,
    staleTime: 30_000,
  });
  if (data && !event) setEvent(data);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <NotFound message={(error as Error)?.message || 'Error'} />;
  }
  return (
    <>
      {event ? (
        <EventDetails
          event={event}
          userRole={userRole}
        />
      ) : (
        <NotFound message='Event not found' />
      )}
    </>
  );
};

export default EventDetailsPage;
