'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { HallType } from '@/types';
import dynamic from 'next/dynamic';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { get, post, del } from '@/lib/api/base';
import ErrorState from '@/components/ui/ErrorState';

const DeleteConfirmationDialog = dynamic(
  () => import('@/components/dialog/DeleteConfirmationDialog'),
  { ssr: false },
);
const EditHallDialog = dynamic(
  () => import('@/components/dialog/EditHallDialog'),
  { ssr: false },
);
const SearchInput = dynamic(() => import('@/components/ui/SearchInput'));
const Pagination = dynamic(() => import('@/components/ui/pagination'));
const Loading = dynamic(
  () => import('@/components/ui/Loading').then((m) => m.Loading),
  { ssr: false },
);
const NotFound = dynamic(() => import('@/components/ui/NotFound'));
const HallCard = dynamic(() => import('@/components/ui/HallCard'));
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddHallDialog } from '@/components/dialog/AddHallDialog';

export default function AdminHallsClient({
  initialHalls,
  initialTotalPages,
  initialTotalItems,
  initialPage,
  perPage,
  initialToken,
}: {
  initialHalls: HallType[];
  initialTotalPages: number;
  initialTotalItems: number;
  initialPage: number;
  perPage: number;
  initialToken?: string;
}) {
  const { toast } = useToast();
  const { token } = useAuth();

  const [halls, setHalls] = useState<HallType[]>(initialHalls || []);
  const [selectedHall, setSelectedHall] = useState<HallType | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'available' | 'unavailable'
  >('all');
  const [capacityFilter, setCapacityFilter] = useState<
    'all' | '<=50' | '51-100' | '101-200' | '>200'
  >('all');

  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [hallsPerPage] = useState(perPage || 6);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['halls', 'admin', currentPage, hallsPerPage],
    queryFn: () =>
      get<{ halls: HallType[]; totalItems: number; totalPages: number }>(
        `/halls?page=${currentPage}&perPage=${hallsPerPage}`,
        {
          token: token || initialToken,
          onError: (err) =>
            toast({
              title: 'Error',
              description: err.message,
              variant: 'destructive',
            }),
        },
      ),
    enabled: !!(token || initialToken),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    initialData: {
      halls: initialHalls || [],
      totalItems: initialTotalItems || 0,
      totalPages: initialTotalPages || 0,
    },
  });

  useEffect(() => {
    if (data?.halls) {
      setHalls(Array.isArray(data.halls) ? data.halls : []);
    }
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: async (hallId: string) =>
      del<{ message?: string }>(`/halls/${hallId}`, { token }),
    onSuccess: (_, hallId) => {
      toast({
        title: 'Deleted Successfully',
        description: 'Hall deleted.',
        className: 'bg-green-500 text-white',
      });
      setHalls((prev) => prev.filter((h) => h._id !== hallId));
      queryClient.invalidateQueries({ queryKey: ['halls', 'admin'] });
      setIsDeleteDialogOpen(false);
      setSelectedHall(null);
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to delete hall',
        variant: 'destructive',
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newHall: HallType) =>
      post<{ message?: string; hall?: HallType }>(`/halls`, newHall, { token }),
    onSuccess: (res) => {
      toast({
        title: 'Successfully!',
        description: res?.message || 'Hall created.',
        className: 'bg-green-600 text-white border-0',
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['halls', 'admin'] });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    },
  });

  const handleAdd = async (newHall: HallType) => {
    createMutation.mutate(newHall);
  };

  const filteredHalls = useMemo(() => {
    return (halls || []).filter((hall) => {
      const matchesQuery =
        hall?.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        hall?.location?.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || (hall.status as any) === statusFilter;
      const c = hall.capacity ?? 0;
      const matchesCapacity =
        capacityFilter === 'all' ||
        (capacityFilter === '<=50' && c <= 50) ||
        (capacityFilter === '51-100' && c >= 51 && c <= 100) ||
        (capacityFilter === '101-200' && c >= 101 && c <= 200) ||
        (capacityFilter === '>200' && c > 200);
      return matchesQuery && matchesStatus && matchesCapacity;
    });
  }, [halls, debouncedQuery, statusFilter, capacityFilter]);

  // pagination derived
  const indexOfLast = currentPage * hallsPerPage;
  const indexOfFirst = indexOfLast - hallsPerPage;
  const currentHalls = filteredHalls.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHalls.length / hallsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, capacityFilter, debouncedQuery]);

  if (isLoading && (initialHalls || []).length === 0) return <Loading />;
  if (isError)
    return (
      <div className='p-6'>
        <ErrorState
          title='Could not load halls'
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-6'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <SearchInput
          name='Hall'
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentPage={() => setCurrentPage(1)}
        />
        <div className='flex items-center gap-3 flex-wrap'>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className='w-[160px] rounded-full border-purple-200 focus:ring-purple-400'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='available'>Available</SelectItem>
              <SelectItem value='unavailable'>Unavailable</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={capacityFilter}
            onValueChange={(v) => setCapacityFilter(v as any)}
          >
            <SelectTrigger className='w-[180px] rounded-full border-purple-200 focus:ring-purple-400'>
              <SelectValue placeholder='Capacity' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Capacities</SelectItem>
              <SelectItem value='<=50'>Up to 50</SelectItem>
              <SelectItem value='51-100'>51 - 100</SelectItem>
              <SelectItem value='101-200'>101 - 200</SelectItem>
              <SelectItem value='>200'>200+</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className='gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full'
          >
            <Plus className='h-4 w-4' /> Add Hall
          </Button>
        </div>
      </div>

      {currentHalls?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl-grid-cols-4 gap-6'
        >
          {currentHalls?.map((hall, index) => (
            <HallCard
              key={hall._id || index}
              hall={hall}
              isAdmin
              onEdit={() => {
                setSelectedHall(hall);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setSelectedHall(hall);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </motion.div>
      ) : (
        <NotFound message='No halls found' />
      )}

      {filteredHalls.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      )}

      <AddHallDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      <EditHallDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        hall={selectedHall}
        token={token}
        onSuccess={(updatedHall) => {
          setHalls((prev) =>
            prev.map((h) => (h?._id === updatedHall?._id ? updatedHall : h)),
          );
          setIsEditDialogOpen(false);
        }}
        toast={toast}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title='Delete Hall'
        description={`Are you sure you want to delete ${selectedHall?.name}?`}
        onConfirm={() => {
          if (!selectedHall) return;
          deleteMutation.mutate(selectedHall._id as string);
        }}
      />
    </div>
  );
}
