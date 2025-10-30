'use client';
<<<<<<< HEAD
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
=======
import { Button } from '@/components/ui/button';
import { CalendarDays, Locate, Ticket } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { EventCategory } from '@/types/type';
import { useToast } from '@/hooks/use-toast';
import EventDetails from '@/components/ui/eventDetials';
const EventDetailsPage = () => {
  const params = useParams();
  const { token, userRole } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventCategory>();
  const eventId = params.eventId;

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/admin/events/${eventId}?`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      setEvent(data.event);
      toast({
        title: 'Fetch successfully',
        description: data.message,
        className: 'bg-green-500 text-white',
      });
    } catch (error: any) {
      // Handle connection errors or unexpected errors.
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred.',
        className: 'bg-red-600 text-white border-0',
      });
    }
  };
  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);  
  if (!event) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Event not found
      </div>
    );
  }

  return (
    <EventDetails event={event} userRole={userRole} />
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  );
};

export default EventDetailsPage;
