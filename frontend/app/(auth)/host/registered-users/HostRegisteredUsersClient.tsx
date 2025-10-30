'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import { EventCategory } from '@/types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { get } from '@/lib/api/base';

const SearchInput = dynamic(() => import('@/components/ui/SearchInput'));
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/Card';
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const Loading = dynamic(() => import('@/components/ui/Loading').then(m => m.Loading), { ssr: false });

export default function HostRegisteredUsersClient({ initialEvents }: { initialEvents: EventCategory[] }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['host-registered-users'],
    queryFn: () => get<{ events: EventCategory[] }>(`/host/events`, {
      token,
      onError: (err) =>
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        }),
    }),
    enabled: !!token,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    initialData: { events: initialEvents || [] },
  });

  const events = data?.events || [];

  const filtered = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter((ev) => ev.title?.toLowerCase().includes(q));
  }, [events, search]);

  if (isLoading && (initialEvents || []).length === 0) return <Loading />;
  if (isError) return <NotFound message={(error as Error)?.message || 'Error'} />;

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='text-2xl font-bold text-purple-900'>
          Registered Users
        </motion.h1>
        <SearchInput name='Users' searchQuery={search} setSearchQuery={setSearch} setCurrentPage={() => {}} />
      </div>

      {filtered?.length === 0 ? (
        <NotFound message='No events found' />
      ) : (
        <div className='space-y-6'>
          {filtered?.map((ev) => (
            <motion.div key={ev._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-purple-800'>{ev.title}</h2>
                  <span className='text-sm text-gray-500'>Total: {ev.registeredUsers?.length || 0}</span>
                </div>
                {(ev.registeredUsers || []).length === 0 ? (
                  <NotFound message='No registered users for this event' />
                ) : (
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader className='bg-gray-50'>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Replace with actual user fields when backend returns details */}
                        {(ev.registeredUsers as any[])?.map((r: any, idx: number) => (
                          <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='hover:bg-purple-50/50'>
                            <TableCell className='font-medium'>{r?.name || '-'}</TableCell>
                            <TableCell>{r?.email || '-'}</TableCell>
                            <TableCell className='capitalize'>{r?.status || '-'}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
