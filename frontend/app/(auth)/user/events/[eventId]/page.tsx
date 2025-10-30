'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import {
  CalendarDays,
  MapPin,
  Clock3,
  Users2,
  Download,
  DollarSign,
  Layers3,
  ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { EventCategory } from '@/types';
import dynamic from 'next/dynamic';
const Loading = dynamic(
  () => import('@/components/ui/Loading').then((m) => m.Loading),
  {
    ssr: false,
    loading: () => <div className='min-h-[50vh]' />,
  }
);
import { fetchEvent } from '@/lib/api/events';
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const EventDetails = dynamic(() => import('@/components/ui/eventDetials'));

export default function EventDetailsPage() {
  const params = useParams();
  const { token, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [event, setEvent] = useState<EventCategory | null>();
  const eventId = params.eventId as string;

  useEffect(() => {
    if (token) {
      fetchEvent(setLoading, token, eventId, undefined, toast).then((data) => {
        setEvent(data);
      });
    }
  }, [token, eventId]);

  if (loading) {
    return <Loading />;
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
}
