'use client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EventCategory } from '@/types';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Gift, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchEvents } from '@/lib/api/events/events';
import { filters } from '@/constants/filters';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { post, del } from '@/lib/api/base';
import dynamic from 'next/dynamic';

// Dynamic UI components
const EventCard = dynamic(() => import('@/components/ui/EventCard'), {
  ssr: false,
  loading: () => (
    <div className='h-64 rounded-xl bg-purple-100/40 animate-pulse' />
  ),
});
const Pagination = dynamic(() => import('@/components/ui/Pagination'), {
  ssr: false,
  loading: () => <div className='h-10' />,
});
const RegisterConfirmationDialog = dynamic(
  () => import('@/components/dialog/RegisterConfirmationDialog'),
  { ssr: false }
);
const UnregisterConfirmationDialog = dynamic(
  () => import('@/components/dialog/UnregisterConfirmationDialog'),
  { ssr: false }
);
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const Loading = dynamic(
  () => import('@/components/ui/Loading').then((m) => m.Loading),
  {
    ssr: false,
    loading: () => <div className='min-h-[40vh]' />,
  }
);

export default function UserEventsClient({
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
  const { token } = useAuth();
  const [events, setEvents] = useState<EventCategory[]>(initialEvents || []);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [selectedEvent, setSelectedEvent] = useState<EventCategory | null>(
    null
  );
  const [isPrice, setIsPrice] = useState(false);
  const [isFree, setIsFree] = useState(false);

  const [isUnregisterModalOpen, setIsUnregisterModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
  const [totalItems, setTotalItems] = useState(initialTotalItems || 0);
  const eventsPerPage = perPage || 6;
  const queryClient = useQueryClient();

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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', 'user', currentPage, eventsPerPage, activeFilter],
    queryFn: () =>
      fetchEvents({
        token,
        currentPage,
        eventsPerPage,
        activeFilter,
        role: 'user',
        toast,
      }),
    enabled: !!token,
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
      setEvents(
        (data.events || []).map((event: EventCategory) => ({
          ...event,
          isRegistered:
            typeof window !== 'undefined' &&
            localStorage.getItem(`registered_${event._id}`) === 'true',
        }))
      );
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalItems || 0);
    }
  }, [data]);

  // Reset price toggles on base filter change
  useEffect(() => {
    setIsPrice(false);
    setIsFree(false);
    setCurrentPage(1);
  }, [activeFilter]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const registerMutation = useMutation({
    mutationFn: async (eventId: string) =>
      post<{ message?: string; url?: string }>(
        `/users/me/events/${eventId}/register`,
        {},
        { token }
      ),
    onSuccess: (data, eventId) => {
      toast({
        title: 'Registration successful',
        description: data?.message || 'Registered.',
        className: 'bg-green-500 text-white border-0',
      });
      localStorage.setItem(`registered_${eventId}`, 'true');
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, isRegistered: true } : e))
      );
      const price = events.find((e) => e._id === eventId)?.price;
      if (data.url && data.url.length && price !== 0) {
        window.location.href = data.url;
      }
      setIsRegisterModalOpen(false);
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
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
      del<{ message?: string }>(
        `/users/me/events/${eventId}/unregister`,
        { token }
      ),
    onSuccess: (data, eventId) => {
      toast({
        title: 'Unregistration successful',
        description: data?.message || 'Unregistered.',
        className: 'bg-green-500 text-white border-0',
      });
      localStorage.removeItem(`registered_${eventId}`);
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, isRegistered: false } : e))
      );
      setIsUnregisterModalOpen(false);
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: ['events', 'user'] });
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

  if (isLoading && events.length === 0) {
    return <Loading />;
  }
  if (isError) {
    return <NotFound message={(error as Error)?.message || 'Error'} />;
  }

  return (
    <section className='px-12 py-12'>
      <h1 className='text-2xl font-bold mb-6 text-center text-purple-800'>
        🎉 My Booked Events
      </h1>
      <div className='flex flex-col md:flex-row gap-4 justify-between items-center mb-6'>
        <div className='relative w-full md:w-1/3 my-6'>
          <div className='absolute inset-y-0 left-0 pl-3 py-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-purple-400' />
          </div>
          <Input
            placeholder='Search events...'
            className='pl-10 pr-4 py-2 rounded-full border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className='flex flex-wrap gap-2 justify-center'>
          {filters.map(({ label, icon: Icon }, index) => {
            const filterKey = label.toLowerCase() as typeof activeFilter;
            const isActive = activeFilter === filterKey;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveFilter(filterKey)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Icon size={18} /> {label}
              </motion.button>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setIsFree(!isFree);
              if (!isFree) setIsPrice(false);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isFree
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Gift size={18} />
            Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setIsPrice(!isPrice);
              if (!isPrice) setIsFree(false);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isPrice
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <DollarSign size={18} />
            Price
          </motion.button>
        </div>
      </div>

      {currentEvents?.length > 0 ? (
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
                      <Button
                        variant='outline'
                        className={`flex items-center gap-2 text-white ${
                          localStorage.getItem(`registered_${event._id}`)
                            ? 'bg-red-600'
                            : 'bg-purple-500'
                        }`}
                        onClick={() => {
                          setSelectedEvent(event);
                          if (localStorage.getItem(`registered_${event._id}`)) {
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
                      {typeof event.price === 'number' && (
                        <span className='bg-purple-50 text-purple-800 font-medium px-3 py-1 rounded-full text-sm shadow-sm'>
                          {event.price === 0 ? 'FREE' : `${event.price} UE`}
                        </span>
                      )}
                    </div>
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <NotFound message='No events found' />
      )}

      {currentEvents.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          paginate={paginate}
        />
      )}

      <UnregisterConfirmationDialog
        open={isUnregisterModalOpen}
        onOpenChange={setIsUnregisterModalOpen}
        onConfirm={() => UnregisterUser()}
        event={selectedEvent}
      />
      <RegisterConfirmationDialog
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        onConfirm={() => RegisterUser()}
        event={selectedEvent}
      />
    </section>
  );
}
