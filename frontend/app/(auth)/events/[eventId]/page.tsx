<<<<<<< HEAD
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
=======
'use client';
import { Button } from '@/components/ui/button';
import { CalendarDays, Locate, Ticket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { useParams } from 'next/navigation';
import EventDetails from '@/components/ui/eventDetials';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { EventCategory } from '@/types/type';
import { useToast } from '@/hooks/use-toast';

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
    <EventDetails
      event={event}
      userRole={userRole}
    />
  );
};

export default EventDetailsPage;
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
