'use client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import EventCard from './EventCard';

import { EventCategory } from '@/types';
import {
  Building,
  Calendar1,
  MapPin,
  Rocket,
  Type,
  University,
  User,
} from 'lucide-react';
import { Button } from './button';
import { useAuth } from '@/context/AuthContext';
import RegisterConfirmationDialog from '@/components/dialog/RegisterConfirmationDialog';
import UnregisterConfirmationDialog from '@/components/dialog/UnregisterConfirmationDialog';
import { API_BASE_URL } from '@/lib/api/base';

const UpcomingEvents = () => {
  const [events, setEvents] = useState<EventCategory[]>([]);

  const { userRole } = useAuth();
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [isUnregisterModalOpen, setIsUnregisterModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventCategory | null>(
    null,
  );

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // تحديث isRegistered من localStorage
      const updatedEvents = data.events.map((event: EventCategory) => ({
        ...event,
        isRegistered:
          localStorage.getItem(`registered_${event._id}`) === 'true',
      }));

      setEvents(updatedEvents);
    } catch (error: any) {
      // Handle connection errors or unexpected errors.
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred.',
        className: 'bg-red-600 text-white border-0',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  const RegisterUser = async () => {
    if (!selectedEvent) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/users/me/events/${selectedEvent._id}/register`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await res.json();
      toast({
        title: 'Registration successful',
        description: data?.message || 'An unexpected error occurred.',
        className: 'bg-green-500 text-white border-0',
      });
      if (res.ok) {
        localStorage.setItem(`registered_${selectedEvent._id}`, 'true');
        setEvents((prev) =>
          prev.map((e) =>
            e._id === selectedEvent._id ? { ...e, isRegistered: true } : e,
          ),
        );

        console.log('data url ', data.url);
        // Status events paid
        if (selectedEvent.price !== 0) {
          window.location.href = data.url;
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred.',
        className: 'bg-red-500 text-white border-0',
      });
    }

    setIsRegisterModalOpen(false);
    setSelectedEvent(null);
  };
  const UnregisterUser = async () => {
    if (!selectedEvent) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/users/me/events/${selectedEvent._id}/unregister`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await res.json();
      toast({
        title: 'Unregistration successful',
        description: data?.message || 'An unexpected error occurred.',
        className: 'bg-green-500 text-white border-0',
      });

      localStorage.removeItem(`registered_${selectedEvent._id}`);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === selectedEvent._id ? { ...e, isRegistered: false } : e,
        ),
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred.',
        className: 'bg-red-500 text-white border-0',
      });
    }

    setIsUnregisterModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section className='relative py-16 bg-gray-50'>
      <div className='absolute inset-x-0 -top-[1px]'>
        <svg
          viewBox='0 0 1440 80'
          className='w-full h-20'
        >
          <path
            d='M0,32 C240,64 480,0 720,16 C960,32 1200,96 1440,64 L1440,0 L0,0 Z'
            fill='#ffffff'
          />
        </svg>
      </div>
      <div className='container mx-auto px-4'>
        {/* The title and filter buttons  */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
          <h2 className='text-3xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-0'>
            Upcoming Events
          </h2>
        </div>

        {/* Card Network */}

        {events?.length > 0 ? (
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            <AnimatePresence>
              {events?.map((event) => {
                return (
                  <motion.div
                    key={event._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      y: -5,
                      transition: { type: 'spring', stiffness: 300 },
                    }}
                    className='relative group'
                  >
                    <EventCard
                      event={event}
                      className='transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/20 group-hover:border-cyan-400/30'
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className='text-xl font-bold'>No events found</div>
        )}
        {/* زر عرض الكل */}
        <div className='text-center'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-md'
          >
            <Link href='/events'>See All Events</Link>
          </motion.button>
        </div>
      </div>
      <RegisterConfirmationDialog
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        onConfirm={RegisterUser}
        event={selectedEvent}
      />
      <UnregisterConfirmationDialog
        open={isUnregisterModalOpen}
        onOpenChange={setIsUnregisterModalOpen}
        onConfirm={UnregisterUser}
        event={selectedEvent}
      />
    </section>
  );
};

export default UpcomingEvents;
