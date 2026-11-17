'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { EventCategory } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetchEvents } from '@/lib/api/events/events';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { post, del } from '@/lib/api/base';
import bgImage from '@/public/bg-events.png';
import { Gift, DollarSign, Sparkles } from 'lucide-react';
import { filters } from '@/constants/filters';
import ErrorState from '@/components/ui/ErrorState';

// Dynamic UI parts
const EventCard = dynamic(() => import('@/components/ui/EventCard'), {
  ssr: false,
  loading: () => (
    <div className='h-64 rounded-xl bg-purple-100/40 animate-pulse' />
  ),
});
const Pagination = dynamic(() => import('@/components/ui/pagination'), {
  ssr: false,
  loading: () => <div className='h-10' />,
});
const RegisterConfirmationDialog = dynamic(
  () => import('@/components/dialog/RegisterConfirmationDialog'),
  { ssr: false },
);
const UnregisterConfirmationDialog = dynamic(
  () => import('@/components/dialog/UnregisterConfirmationDialog'),
  { ssr: false },
);
const FloatingBlobs = dynamic(
  () => import('@/constants/FloatingBlobs').then((m) => m.FloatingBlobs),
  {
    ssr: false,
  },
);
const Loading = dynamic(
  () => import('@/components/ui/Loading').then((m) => m.Loading),
  {
    ssr: false,
    loading: () => <div className='min-h-[50vh]' />,
  },
);
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const SearchInput = dynamic(() => import('@/components/ui/SearchInput'));

export default function EventsClient({
  initialEvents,
  initialTotalPages,
  initialTotalItems,
  initialPage,
  perPage,
}: {
  initialEvents: EventCategory[];
  initialTotalPages: number;
  initialTotalItems: number;
  initialPage: number;
  perPage: number;
}) {
  const { toast } = useToast();
  const { token, userRole } = useAuth();
  const queryClient = useQueryClient();

  const [events, setEvents] = useState<EventCategory[]>(initialEvents || []);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>(
    'all',
  );
  const [isPrice, setIsPrice] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const [selectedEvent, setSelectedEvent] = useState<EventCategory | null>(
    null,
  );
  const [isUnregisterModalOpen, setIsUnregisterModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
  const [totalItems, setTotalItems] = useState(initialTotalItems || 0);
  const eventsPerPage = perPage || 6;

  const currentEvents = (events || []).filter((event) => {
    const matchesSearch = event.title
      ?.toLowerCase()
      .includes(debouncedQuery.toLowerCase());
    const matchesBasicFilter =
      activeFilter === 'all' ||
      (activeFilter === 'upcoming' && event.status === 'upcoming') ||
      (activeFilter === 'past' && event.status === 'past');
    const matchesPriceFilter =
      (!isPrice && !isFree) ||
      (isPrice && event?.price !== 0) ||
      (isFree && event?.price === 0);
    return matchesSearch && matchesBasicFilter && matchesPriceFilter;
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events', 'public', currentPage, eventsPerPage, activeFilter],
    queryFn: () =>
      fetchEvents({
        token,
        currentPage,
        eventsPerPage,
        activeFilter,
        role: 'public',
        toast,
      }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    initialData: {
      events: initialEvents || [],
      totalPages: initialTotalPages || 0,
      totalItems: initialTotalItems || 0,
    },
  });

  useEffect(() => {
    if (data) {
      setEvents(data.events || []);
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalItems || 0);
    }
  }, [data]);

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Reset price/free toggles when base filter changes
  useEffect(() => {
    setIsPrice(false);
    setIsFree(false);
  }, [activeFilter]);

  // Mutations
  const registerMutation = useMutation({
    mutationFn: async (eventId: string) =>
      post<{ message?: string; url?: string }>(
        `/users/me/events/${eventId}/register`,
        {},
        { token },
      ),
    onSuccess: (data, eventId) => {
      toast({
        title: 'Registration successful',
        description: data?.message || 'Registered.',
        className: 'bg-green-500 text-white border-0',
      });
      localStorage.setItem(`registered_${eventId}`, 'true');
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, isRegistered: true } : e)),
      );
      if (
        data.url &&
        data.url.length &&
        (events.find((e) => e._id === eventId)?.price ?? 0) !== 0
      ) {
        window.location.href = data.url;
      }
      setIsRegisterModalOpen(false);
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: ['events', 'public'] });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'An unexpected error occurred.',
        className: 'bg-red-500 text-white border-0',
      });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async (eventId: string) =>
      del<{ message?: string }>(`/users/me/events/${eventId}/unregister`, {
        token,
      }),
    onSuccess: (data, eventId) => {
      toast({
        title: 'Unregistration successful',
        description: data?.message || 'Unregistered.',
        className: 'bg-green-500 text-white border-0',
      });
      localStorage.removeItem(`registered_${eventId}`);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId ? { ...e, isRegistered: false } : e,
        ),
      );
      setIsUnregisterModalOpen(false);
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: ['events', 'public'] });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'An unexpected error occurred.',
        className: 'bg-red-500 text-white border-0',
      });
    },
  });

  const RegisterUser = async () => {
    if (!selectedEvent) return;
    registerMutation.mutate(selectedEvent._id as string);
  };
  const UnregisterUser = async () => {
    if (!selectedEvent) return;
    unregisterMutation.mutate(selectedEvent._id as string);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isError) {
    return (
      <div className='p-6'>
        <ErrorState
          title='Could not load events'
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <main className='bg-white min-h-screen relative overflow-hidden'>
      <section className='relative flex items-center justify-center h-[60vh] py-20 text-center'>
        <div className='absolute inset-0 z-0'>
          <Image
            src={bgImage}
            alt='Modern Purple Background'
            layout='fill'
            objectFit='cover'
            className='brightness-75'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-pink-900/40' />
          <FloatingBlobs />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='relative z-10'
        >
          <motion.h1
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 6, repeat: Infinity }}
            className='text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6'
          >
            All Events
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='text-xl text-purple-100/90 font-light max-w-2xl mx-auto px-4 drop-shadow-lg'
          >
            Discover curated events blending education, networking, and
            entertainment. Explore unique experiences tailored for modern
            enthusiasts.
          </motion.p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='absolute -top-20 -right-20 opacity-20'
          >
            <Sparkles
              size={200}
              className='text-cyan-400 animate-pulse'
            />
          </motion.div>
        </motion.div>
      </section>

      <div className='max-w-6xl mx-auto px-4 py-10'>
        <div className='flex flex-wrap justify-center items-center gap-4 mb-14'>
          {/* Search Input */}
          <SearchInput
            name='Events'
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentPage={() => setCurrentPage(1)}
          />

          {filters.map(({ label, icon: Icon }, index) => {
            const filterKey = label.toLowerCase() as typeof activeFilter;
            return (
              <motion.button
                key={index}
                whileHover={{
                  scale: 1.05,
                  background: 'linear-gradient(45deg, #9333ea, #4f46e5)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filterKey)}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-full border-2 backdrop-blur-lg transition-all duration-300 hover:bg-purple-500/20 ${
                  activeFilter === filterKey
                    ? 'border-purple-500/30 bg-purple-500 text-black'
                    : 'border-white/10 bg-purple-900 text-white'
                }`}
                style={{
                  boxShadow:
                    activeFilter === filterKey
                      ? '0 4px 24px -2px rgba(165, 180, 252, 0.3)'
                      : 'none',
                }}
              >
                <Icon
                  size={20}
                  className='text-cyan-400'
                />
                <span className='text-sm font-medium tracking-wide'>
                  {label}
                </span>
                {activeFilter === filterKey && (
                  <motion.div
                    className='absolute -bottom-2 h-1 bg-cyan-400 rounded-full'
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Price/Free toggles */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsFree(!isFree);
              if (!isFree) setIsPrice(false);
              setCurrentPage(1);
            }}
            className={`relative flex items-center gap-3 px-6 py-3 rounded-full border-2 backdrop-blur-lg transition-all duration-300 ${
              isFree
                ? 'border-purple-500/30 bg-purple-500 text-black'
                : 'border-white/10 bg-purple-900 text-white'
            }`}
            style={{
              boxShadow: isFree
                ? '0 4px 24px -2px rgba(165, 180, 252, 0.3)'
                : 'none',
            }}
          >
            <Gift
              size={20}
              className='text-cyan-400'
            />
            <span className='text-sm font-medium tracking-wide'>Free</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPrice(!isPrice);
              if (!isPrice) setIsFree(false);
              setCurrentPage(1);
            }}
            className={`relative flex items-center gap-3 px-6 py-3 rounded-full border-2 backdrop-blur-lg transition-all duration-300 ${
              isPrice
                ? 'border-purple-500/30 bg-purple-500 text-black'
                : 'border-white/10 bg-purple-900 text-white'
            }`}
            style={{
              boxShadow: isPrice
                ? '0 4px 24px -2px rgba(165, 180, 252, 0.3)'
                : 'none',
            }}
          >
            <DollarSign
              size={20}
              className='text-cyan-400'
            />
            <span className='text-sm font-medium tracking-wide'>Price</span>
          </motion.button>
        </div>

        {isLoading && events.length === 0 ? (
          <Loading />
        ) : currentEvents?.length > 0 ? (
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
          >
            <AnimatePresence>
              {currentEvents?.map((event, index) => (
                <motion.div
                  key={index}
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
                    href={`events/${event._id}`}
                    className='transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/20 group-hover:border-cyan-400/30'
                    footer={
                      <div className='flex items-center gap-3'>
                        {userRole === 'user' && (
                          <Button
                            variant='outline'
                            className={`flex items-center gap-2 text-white ${
                              localStorage.getItem(`registered_${event._id}`)
                                ? 'bg-red-600'
                                : 'bg-purple-500'
                            }`}
                            onClick={() => {
                              setSelectedEvent(event);
                              if (
                                localStorage.getItem(`registered_${event._id}`)
                              ) {
                                setIsUnregisterModalOpen(true);
                              } else {
                                setIsRegisterModalOpen(true);
                              }
                            }}
                          >
                            {localStorage.getItem(`registered_${event._id}`)
                              ? 'Unregister'
                              : 'Register'}
                          </Button>
                        )}
                        {typeof event.price === 'number' && (
                          <span className='bg-purple-50 text-purple-800 font-medium px-3 py-1 rounded-full text-sm shadow-sm'>
                            {event.price === 0 ? 'FREE' : `${event.price} UE`}
                          </span>
                        )}
                      </div>
                    }
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='absolute top-2 right-2 p-2 bg-purple-600/80 rounded-full backdrop-blur-sm'
                  ></motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <NotFound message='No events found' />
        )}
      </div>

      {/* Pagination Controls */}
      {currentEvents.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}

      {/* Dialogs */}
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
    </main>
  );
}
