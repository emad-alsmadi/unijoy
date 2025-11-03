'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/context/AuthContext';
import { EventCategory } from '@/types';
import { filterLabels } from '@/constants/filters';
import { fetchEvents } from '@/lib/api/events/events';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { del } from '@/lib/api/base';
import {
  Calendar,
  Plus,
  Gift,
  DollarSign,
  Check,
  X,
  Clock,
  Activity,
} from 'lucide-react';

// dynamic components
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
const SearchInput = dynamic(() => import('@/components/ui/SearchInput'));
const DeleteConfirmationDialog = dynamic(
  () => import('@/components/dialog/DeleteConfirmationDialog'),
  { ssr: false }
);
const EventStatusDialog = dynamic(
  () => import('@/components/dialog/EventStatusDialog'),
  { ssr: false }
);
const CalendarComp = dynamic(
  () => import('@/components/ui/calendar').then((m) => m.Calendar),
  { ssr: false }
);
const RoleChart = dynamic(() => import('@/components/admin/users/RoleChart'), {
  ssr: false,
});
const SignupTrendChart = dynamic(
  () => import('@/components/admin/users/SignupTrendChart'),
  { ssr: false }
);
const { Tabs, TabsList, TabsTrigger } = await import('@/components/ui/tabs');
import { StatCard } from '@/components/ui/StatCard';
import NotFound from '@/components/ui/NotFound';
import { Loading } from '@/components/ui/Loading';

export default function AdminEventsClient({
  initialEvents,
  initialTotalPages,
  initialTotalItems,
  initialPage,
  perPage,
  initialToken,
}: {
  initialEvents: EventCategory[];
  initialTotalPages: number;
  initialTotalItems: number;
  initialPage: number;
  perPage: number;
  initialToken?: string;
}) {
  const { toast } = useToast();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [events, setEvents] = useState<EventCategory[]>(initialEvents || []);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'upcoming' | 'past' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [isPrice, setIsPrice] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'approve' | 'reject' | null>(
    null
  );
  const [selectedEvent, setSelectedEvent] = useState<EventCategory | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
  const [totalItems, setTotalItems] = useState(initialTotalItems || 0);
  const eventsPerPage = perPage || 6;

  const currentEvents = events?.filter((event) => {
    const matchesSearch = event?.title
      ?.toLowerCase()
      .includes(debouncedQuery.toLowerCase());
    const matchesBasicFilter =
      activeFilter === 'all' ||
      (activeFilter === 'upcoming' && event.status === 'upcoming') ||
      (activeFilter === 'past' && event.status === 'past') ||
      (activeFilter === 'pending' && event.status === 'pending') ||
      (activeFilter === 'approved' && event.status === 'approved') ||
      (activeFilter === 'rejected' && event.status === 'rejected');
    const matchesPriceFilter =
      (!isPrice && !isFree) ||
      (isPrice && event?.price !== 0) ||
      (isFree && event?.price === 0);
    return matchesSearch && matchesBasicFilter && matchesPriceFilter;
  });

  const { data, isLoading, isError, error } = useQuery({
    //So any change in currentPage completely changes the key,
    //  and this makes React Query treat it as a "new query" and call queryFn()
    //  again inside queryFn(). ...
    queryKey: ['events', 'admin', currentPage, eventsPerPage, activeFilter],
    queryFn: () =>
      fetchEvents({
        token: token || initialToken,
        currentPage,
        eventsPerPage,
        activeFilter,
        role: 'admin',
        toast,
      }),
    //This pauses the query until the token is defined.
    enabled: !!(token || initialToken),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    //This makes React Query keep the previous page data while fetching the new page.
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

  useEffect(() => {
    setCurrentPage(1);
    setIsPrice(false);
    setIsFree(false);
  }, [activeFilter]);

  const onDelete = (event: EventCategory) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) =>
      del<{ message?: string }>(`/host/events/${eventId}`, { token }),
    onSuccess: (res) => {
      toast({
        title: 'Event Deleted',
        description: res?.message || 'Event deleted successfully.',
        className: 'bg-green-600 text-white border-0',
      });
      queryClient.invalidateQueries({ queryKey: ['events', 'admin'] });
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'An unexpected error occurred.',
        className: 'bg-red-500 text-white border-0',
      });
    },
  });

  const handleDelete = async () => {
    if (!selectedEvent) return;
    deleteMutation.mutate(selectedEvent._id as string);
  };

  const approvedCount = events.filter((e) => e.status === 'approved').length;
  const pendingCount = events.filter((e) => e.status === 'pending').length;
  const rejectedCount = events.filter((e) => e.status === 'rejected').length;
  const kpis = useMemo(() => {
    const total = events.length;
    return [
      { title: 'Approved', value: approvedCount, change: '+0%', icon: Check },
      { title: 'Rejected', value: rejectedCount, change: '-0%', icon: X },
      { title: 'Pending', value: pendingCount, change: '+0%', icon: Clock },
      { title: 'Total', value: total, change: '+0%', icon: Activity },
    ];
  }, [events, approvedCount, rejectedCount, pendingCount]);

  const trendData = useMemo(() => {
    const map = new Map<string, number>();
    (events || []).forEach((e) => {
      const dateStr =
        (e as any).date || (e as any).startDate || (e as any).createdAt;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    const entries = Array.from(map.entries()).sort((a, b) =>
      a[0] < b[0] ? -1 : 1
    );
    return entries.map(([ym, count]) => {
      const [y, m] = ym.split('-');
      const date = new Date(Number(y), Number(m) - 1, 1);
      const label = date.toLocaleString(undefined, { month: 'short' });
      return { label, value: count };
    });
  }, [events]);

  if (isLoading) {
    return <Loading />;
  }
  // لا تعرض شاشة Loading كاملة، سنعرض سكيليتون داخل الصفحة بالأسفل
  if (isError) {
    return <NotFound message={(error as Error)?.message || 'Error'} />;
  }

  return (
    <main className='bg-white min-h-screen relative py-10'>
      <div className='max-w-8xl mx-auto px-8 relative'>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        >
          {kpis.map((k, index) => (
            <StatCard
              key={k.title}
              title={k.title}
              value={k.value}
              change={k.change}
              icon={k.icon as any}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className='grid grid-cols-1 lg:grid-cols-3 gap-6 my-6'
        >
          <div className='lg:col-span-2'>
            <SignupTrendChart data={trendData} />
          </div>
          <div>
            <RoleChart
              data={[
                { label: 'Approved', value: approvedCount, color: '#16a34a' },
                { label: 'Pending', value: pendingCount, color: '#f59e0b' },
                { label: 'Rejected', value: rejectedCount, color: '#ef4444' },
              ]}
            />
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div className='flex flex-col lg:flex-row gap-4 items-stretch my-8'>
          <SearchInput
            name='Events'
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentPage={() => setCurrentPage(1)}
          />

          <div className='flex-1 overflow-x-auto'>
            <Tabs
              value={activeFilter}
              onValueChange={(val: any) => {
                setActiveFilter(val);
                setCurrentPage(1);
              }}
              className='w-full'
            >
              <TabsList className='bg-transparent gap-1 p-1 flex-wrap justify-start w-full'>
                {filterLabels.map(({ label, icon: Icon, value }) => (
                  <TabsTrigger
                    value={value as any}
                    key={value}
                    className='data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-full px-3 py-1 text-xs md:text-sm md:px-4 md:py-2 transition-all whitespace-nowrap'
                  >
                    <div className='flex items-center gap-1 md:gap-2'>
                      <Icon className='h-3 w-3 md:h-4 md:w-4' />
                      {label}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className='flex gap-2 items-center'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFree(!isFree);
                if (!isFree) setIsPrice(false);
                setCurrentPage(1);
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                isFree
                  ? 'border-purple-500/30 bg-purple-600 text-white'
                  : 'border-white/10 bg-purple-900 text-white'
              }`}
            >
              <Gift className='h-4 w-4' />
              <span className='text-sm'>Free</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsPrice(!isPrice);
                if (!isPrice) setIsFree(false);
                setCurrentPage(1);
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                isPrice
                  ? 'border-purple-500/30 bg-purple-600 text-white'
                  : 'border-white/10 bg-purple-900 text-white'
              }`}
            >
              <DollarSign className='h-4 w-4' />
              <span className='text-sm'>Price</span>
            </motion.button>
          </div>

          <Popover
            open={isCalendarOpen}
            onOpenChange={setIsCalendarOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='rounded-full gap-2'
              >
                <Calendar className='h-4 w-4' />
                <span>Select Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0'
              align='end'
            >
              <CalendarComp
                mode='single'
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button className='bg-gradient-to-r from-purple-800 to-pink-700'>
            <Plus className='text-white' />
            <Link href='/create'>Create Events</Link>
          </Button>
        </motion.div>

        {/* Grid */}
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
              {currentEvents?.map((event) => (
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
                    role='admin'
                    actionsMode='menu'
                    onApprove={() => {
                      setSelectedEvent(event);
                      setStatusAction('approve');
                      setIsStatusDialogOpen(true);
                    }}
                    onReject={() => {
                      setSelectedEvent(event);
                      setStatusAction('reject');
                      setIsStatusDialogOpen(true);
                    }}
                    onStatusChange={() => {
                      setSelectedEvent(event);
                      setStatusAction('approve');
                      setIsStatusDialogOpen(true);
                    }}
                    onEdit={() => {
                      window.location.href = `/admin/events/${event._id}/edit`;
                    }}
                    onDelete={() => onDelete(event)}
                    onDownloadInvoice={() => {
                      /* kept same API from original page */
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className='text-center py-30 space-y-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className='text-xl font-bold'>No events found</div>
            <p className='text-muted-foreground'>
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first event to get started'}
            </p>
            <Button className='bg-gradient-to-r from-purple-800 to-pink-700'>
              <Plus className='text-white' />
              <Link href='/create'>Create Events</Link>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {currentEvents.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          paginate={(p: number) => setCurrentPage(p)}
        />
      )}

      {/* Dialogs */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title='Delete Event'
        description={`Are you sure you want to delete ${selectedEvent?.title}?`}
        onConfirm={handleDelete}
      />
      <EventStatusDialog
        open={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        event={selectedEvent}
        action={statusAction}
        onSuccess={(updatedEvent) => {
          setEvents((prev) =>
            prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
          );
          setIsStatusDialogOpen(false);
          setSelectedEvent(null);
        }}
      />
    </main>
  );
}
