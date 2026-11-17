'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { HallType } from '@/types';
import dynamic from 'next/dynamic';
import { get } from '@/lib/api/base';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import ErrorState from '@/components/ui/ErrorState';

const SearchInput = dynamic(() => import('@/components/ui/SearchInput'));
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const HallCard = dynamic(() => import('@/components/ui/HallCard'));
const Pagination = dynamic(() => import('@/components/ui/pagination'));

export default function HallsClient({
  initialHalls,
  initialTotalPages,
  initialTotalItems,
  initialPage,
  perPage,
}: {
  initialHalls: HallType[];
  initialTotalPages: number;
  initialTotalItems: number;
  initialPage: number;
  perPage: number;
}) {
  const { token } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
  const [totalItems, setTotalItems] = useState(initialTotalItems || 0);
  const hallsPerPage = perPage || 3;

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'available' | 'reserved'
  >('all');
  const [capacityFilter, setCapacityFilter] = useState<
    'all' | 'lt100' | '100to300' | 'gt300'
  >('all');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['halls', currentPage, hallsPerPage, token],
    queryFn: () =>
      get<{ halls: HallType[]; totalItems: number; totalPages: number }>(
        `/halls?page=${currentPage}&perPage=${hallsPerPage}`,
        { token },
      ),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    initialData:
      initialHalls || initialTotalItems || initialTotalPages
        ? {
            halls: initialHalls || [],
            totalItems: initialTotalItems || 0,
            totalPages: initialTotalPages || 0,
          }
        : undefined,
  });

  const halls = data?.halls || [];
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, statusFilter, capacityFilter]);

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    }
  }, [data]);

  const currentHall = useMemo(() => {
    const byQuery = (halls || []).filter(
      (hall) =>
        hall.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        hall.location.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );

    const byStatus =
      statusFilter === 'all'
        ? byQuery
        : byQuery.filter((h) => (h.status || 'available') === statusFilter);

    const byCapacity = byStatus.filter((h) => {
      if (capacityFilter === 'all') return true;
      if (capacityFilter === 'lt100') return (h.capacity || 0) < 100;
      if (capacityFilter === '100to300')
        return (h.capacity || 0) >= 100 && (h.capacity || 0) <= 300;
      if (capacityFilter === 'gt300') return (h.capacity || 0) > 300;
      return true;
    });

    return byCapacity;
  }, [halls, debouncedQuery, statusFilter, capacityFilter]);

  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center h-[70vh]'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500'></div>
        </div>
      ) : isError ? (
        <div className='p-6'>
          <ErrorState
            title='Could not load halls'
            error={error}
            onRetry={() => refetch()}
          />
        </div>
      ) : (
        <div className='p-6 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen'>
          <div className='grid grid-cols-1 md:grid-cols-3 items-center gap-4'>
            <SearchInput
              name='Hall'
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setCurrentPage={() => setCurrentPage(1)}
            />
            <div className='flex gap-3'>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as any)}
              >
                <SelectTrigger className='w-full md:w-[180px] bg-white/60 backdrop-blur border-purple-200'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All status</SelectItem>
                  <SelectItem value='available'>Available</SelectItem>
                  <SelectItem value='reserved'>Reserved</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={capacityFilter}
                onValueChange={(v) => setCapacityFilter(v as any)}
              >
                <SelectTrigger className='w-full md:w-[200px] bg-white/60 backdrop-blur border-purple-200'>
                  <SelectValue placeholder='Capacity' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All capacities</SelectItem>
                  <SelectItem value='lt100'>&lt; 100</SelectItem>
                  <SelectItem value='100to300'>100 - 300</SelectItem>
                  <SelectItem value='gt300'>&gt; 300</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentHall?.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
              >
                {currentHall.map((hall, index) => (
                  <HallCard
                    key={hall._id || index}
                    hall={hall}
                  />
                ))}
              </motion.div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            </>
          ) : (
            <NotFound message='The Hall are not found' />
          )}

          {!!totalItems && (
            <div className='text-sm text-gray-600'>Total: {totalItems}</div>
          )}
        </div>
      )}
    </>
  );
}
