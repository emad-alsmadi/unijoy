'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { EventCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import EventDetails from '@/components/ui/eventDetials';
import { fetchEvent } from '@/lib/api/events';
import NotFound from '@/components/ui/NotFound';
const EventDetailsPage = () => {
  const params = useParams();
  const { token, userRole } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<EventCategory | null>(null);
  const eventId = params.eventId as string;

  useEffect(() => {
    if (token) {
      fetchEvent(setLoading, token, eventId, 'host', toast).then((data) => {
        setEvent(data);
      });
    }
  }, [token, eventId]);

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
