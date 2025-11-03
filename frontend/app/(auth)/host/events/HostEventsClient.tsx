'use client';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Gift, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventCategory } from '@/types';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import { useDebounce } from 'use-debounce';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import SearchInput from '@/components/ui/SearchInput';
import { fetchEvents } from '@/lib/api/events/events';
import { StatCard } from '@/components/ui/StatCard';
import { Check, X, Clock, Activity } from 'lucide-react';
import RoleChart from '@/components/admin/users/RoleChart';
import SignupTrendChart from '@/components/admin/users/SignupTrendChart';
import { Card } from '@/components/ui/Card';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { del } from '@/lib/api/base';

const Loading = dynamic(
  () => import('@/components/ui/Loading').then((m) => m.Loading),
  { ssr: false }
);
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const EventCard = dynamic(() => import('@/components/ui/EventCard'));
const Pagination = dynamic(() => import('@/components/ui/pagination'));
const DeleteConfirmationDialog = dynamic(
  () => import('@/components/dialog/DeleteConfirmationDialog'),
  { ssr: false }
);

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

export default function HostEventsClient({
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
  const [events, setEvents] = useState<EventCategory[]>(initialEvents || []);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'upcoming' | 'past' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [selectedEvent, setSelectedEvent] = useState<EventCategory | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrice, setIsPrice] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
  const [totalItems, setTotalItems] = useState(initialTotalItems || 0);
  const eventsPerPage = perPage || 6;
  const queryClient = useQueryClient();

  const kpis = useMemo(() => {
    const total = events.length;
    const approved = events.filter((e) => e.status === 'approved').length;
    const rejected = events.filter((e) => e.status === 'rejected').length;
    const pending = events.filter((e) => e.status === 'pending').length;
    return [
      { title: 'Approved', value: approved, change: '+0%', icon: Check },
      { title: 'Rejected', value: rejected, change: '-0%', icon: X },
      { title: 'Pending', value: pending, change: '+0%', icon: Clock },
      { title: 'Total', value: total, change: '+0%', icon: Activity },
    ];
  }, [events]);

  const roleSlices = useMemo(
    () => [
      {
        label: 'Approved',
        value: events.filter((e) => e.status === 'approved').length,
        color: '#16a34a',
      },
      {
        label: 'Pending',
        value: events.filter((e) => e.status === 'pending').length,
        color: '#f59e0b',
      },
      {
        label: 'Rejected',
        value: events.filter((e) => e.status === 'rejected').length,
        color: '#ef4444',
      },
    ],
    [events]
  );

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

  const currentEvents = (events || [])?.filter((event) => {
    const matchesSearch = event.title
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
    queryKey: ['events', 'host', currentPage, eventsPerPage, activeFilter],
    queryFn: () =>
      fetchEvents({
        token: token || initialToken,
        currentPage,
        eventsPerPage,
        activeFilter,
        role: 'host',
        toast,
      }),
    enabled: !!(token || initialToken),
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

  useEffect(() => {
    setCurrentPage(1);
    setIsPrice(false);
    setIsFree(false);
  }, [activeFilter]);

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => del<{ message?: string }>(`/host/events/${eventId}`, { token }),
    onSuccess: (res) => {
      toast({
        title: 'Event Deleted',
        description: res?.message || 'Event deleted successfully.',
        className: 'bg-green-600 text-white border-0',
      });
      queryClient.invalidateQueries({ queryKey: ['events', 'host'] });
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

  const generateReport = (event: EventCategory) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Booking Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Student Name: Test User`, 20, 40);
    doc.text(`Student Email: test@example.com`, 20, 50);
    doc.text(`Event Name: ${event.title}`, 20, 70);
    doc.text(`Location: ${event.location}`, 20, 80);
    doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 20, 90);
    doc.text(`Registered: #${event.isRegistered}`, 20, 110);
    doc.text('Thank you for booking with us!', 20, 130);
    doc.save(`Invoice-${event.title}.pdf`);
  };

  const handleDelete = async () => {
    if (!token || !selectedEvent) return;
    deleteMutation.mutate(selectedEvent._id as string);
  };

  if (isLoading && events.length === 0) return <Loading />;
  if (isError)
    return <NotFound message={(error as Error)?.message || 'Error'} />;

  return (
    <main className='bg-white min-h-screen relative overflow-hidden'>
      <Card className='bg-gradient-to-r from-purple-900 to-pink-900 text-white'>
        <div className='p-6 flex flex-col gap-2'>
          <h2 className='text-2xl font-bold'>Welcome back, Host!</h2>
          <p className='opacity-90'>
            Manage your events, track status, and create new experiences.
          </p>
        </div>
      </Card>
      <div className='max-w-6xl mx-auto px-4 relative'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8'
        >
          {kpis.map((k, i) => (
            <StatCard
              key={k.title}
              title={k.title}
              value={k.value}
              change={k.change}
              icon={k.icon as any}
              delay={i * 0.05}
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
            <RoleChart data={roleSlices} />
          </div>
        </motion.div>
        <motion.div
          className='flex flex-col lg:flex-row gap-4 items-stretch my-8'
          variants={itemVariants}
        >
          <SearchInput
            name='Events'
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentPage={() => setCurrentPage(1)}
          />
          <div className='flex gap-2 items-center'>
            {(['all', 'approved', 'pending', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  setCurrentPage(1);
                }}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ring-1 ring-purple-200/60 hover:ring-purple-400/60 ${
                  activeFilter === f
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                    : 'bg-white text-purple-700 hover:bg-purple-50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFree(!isFree);
                if (!isFree) setIsPrice(false);
                setCurrentPage(1);
              }}
              className={`flex justify-center items-center relative px-4 py-2 rounded-full text-sm font-medium transition-all ring-1 ring-purple-200/60 hover:ring-purple-400/60 ${
                isFree
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                  : 'bg-white text-purple-700 hover:bg-purple-50'
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
              className={`flex justify_center items-center relative px-4 py-2 rounded-full text-sm font-medium transition-all ring-1 ring-purple-200/60 hover:ring-purple-400/60 ${
                isPrice
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                  : 'bg-white text-purple-700 hover:bg-purple-50'
              }`}
            >
              <DollarSign className='h-4 w-4' />
              <span className='text-sm'>Price</span>
            </motion.button>
          </div>
        </motion.div>
        {currentEvents.length ? (
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
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    transition: { type: 'spring', stiffness: 300 },
                  }}
                  className='relative group'
                >
                  <EventCard
                    key={event._id}
                    event={event}
                    role='host'
                    actionsMode='menu'
                    className='transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/20 group-hover:border-cyan-400/30'
                    onEdit={() => {
                      setSelectedEvent(event);
                    }}
                    onDelete={() => {
                      setSelectedEvent(event);
                      setIsDeleteDialogOpen(true);
                    }}
                    onDownloadInvoice={() => generateReport(event)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <NotFound message='No events found' />
        )}
        {events.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={setCurrentPage}
          />
        )}
        <Link
          href='/create'
          className='fixed bottom-6 right-6 z-40'
        >
          <span className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg px-5 py-3'>
            <Plus className='h-5 w-5' /> Create Event
          </span>
        </Link>
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          title='Delete Event'
          description={`Are you sure you want to delete ${selectedEvent?.title}?`}
          onConfirm={handleDelete}
        />
      </div>
    </main>
  );
}
