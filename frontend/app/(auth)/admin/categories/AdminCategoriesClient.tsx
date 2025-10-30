'use client';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from 'use-debounce';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { HostCategory } from '@/types';
import NotFound from '@/components/ui/NotFound';
import { get, post, del } from '@/lib/api/base';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

const SearchInput = dynamic(() => import('@/components/ui/SearchInput'));
const Pagination = dynamic(() => import('@/components/ui/pagination'), {
  ssr: false,
  loading: () => <div className='h-10' />,
});
const Loading = dynamic(
  () => import('@/components/ui/Loading').then((m) => m.Loading),
  { ssr: false, loading: () => <div className='min-h-[30vh]' /> }
);
const CategorieCard = dynamic(() => import('@/components/ui/CategorieCard'), {
  ssr: false,
  loading: () => (
    <div className='h-60 rounded-xl bg-purple-100/40 animate-pulse' />
  ),
});
const AddCategoryDialog = dynamic(
  () =>
    import('@/components/dialog/AddCategoryDialog').then(
      (m) => m.AddCategoryDialog
    ),
  { ssr: false }
);
const EditCategoryDialog = dynamic(
  () => import('@/components/dialog/EditCategoryDialog'),
  { ssr: false }
);
const DeleteConfirmationDialog = dynamic(
  () => import('@/components/dialog/DeleteConfirmationDialog'),
  { ssr: false }
);

export default function AdminCategoriesClient({
  initialCategories,
  initialTotalPages,
  initialTotalItems,
  initialPage,
  perPage,
}: {
  initialCategories: HostCategory[];
  initialTotalPages: number;
  initialTotalItems: number;
  initialPage: number;
  perPage: number;
}) {
  const { toast } = useToast();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<HostCategory | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
  const [totalItems, setTotalItems] = useState(initialTotalItems || 0);
  const [categoriesPerPage] = useState(perPage || 6);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(initialPage || 1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-categories', currentPage, categoriesPerPage],
    queryFn: () =>
      get<{
        categories: HostCategory[];
        totalItems: number;
        totalPages: number;
      }>(`/host-categories?page=${currentPage}&perPage=${categoriesPerPage}`, {
        token,
        onError: (err: any) => {
          toast({
            title: 'Error',
            description: err.message,
            variant: 'destructive' as any,
          });
        },
      }),
    enabled: !!token,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    initialData: {
      categories: initialCategories || [],
      totalItems: initialTotalItems || 0,
      totalPages: initialTotalPages || 0,
    },
  });

  const categories = data?.categories ?? [];

  const filtered = useMemo(() => {
    let temp = categories;
    if (activeFilter !== 'all')
      temp = temp.filter((c) => c.name === activeFilter);
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      temp = temp.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    return temp;
  }, [categories, activeFilter, debouncedQuery]);

  useEffect(() => {
    setTotalPages(data?.totalPages ?? 1);
    setTotalItems(data?.totalItems ?? 0);
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/host-categories/${id}`, { token }),
    onSuccess: () => {
      toast({
        title: 'Category Deleted',
        description: 'Category was deleted successfully.',
        className: 'bg-green-600 text-white border-0',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive' as any,
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      post<{ category: HostCategory; message?: string }>(
        `/host-categories`,
        payload,
        { token }
      ),
    onSuccess: (res) => {
      toast({
        title: 'successfully!',
        description: res.message || 'Category added successfully!',
        className: 'bg-green-600 text-white border-0',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsAddDialogOpen(false);
    },
    onError: (err: any) => {
      toast({
        title: 'error',
        description: err.message || 'Something went wrong.',
        variant: 'destructive' as any,
      });
    },
  });

  const uniqueFilters = [
    'all',
    ...Array.from(new Set(categories?.map((c) => c?.name))),
  ] as string[];

  const handleDelete = async () => {
    if (!selectedCategory) return;
    deleteMutation.mutate(selectedCategory._id as string);
  };
  const handleAdd = async (newCategory: {
    name: string;
    description: string;
  }) => {
    addMutation.mutate(newCategory);
  };
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading && (initialCategories || []).length === 0) return <Loading />;
  if (isError)
    return <NotFound message={(error as Error)?.message || 'Error'} />;

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <SearchInput
          name='Host Categories'
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentPage={() => setCurrentPage(1)}
        />
        <div className='flex justify-between items-center'>
          <div className='flex justify-end'>
            <Button
              className='mr-4 bg-purple-800'
              onClick={() => setIsAddDialogOpen(true)}
            >
              + Add Host Category
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='capitalize w-full md:w-40'
              >
                {activeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {uniqueFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className='capitalize cursor-pointer'
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filtered.map((categorie, index) => (
            <CategorieCard
              key={categorie._id}
              index={index}
              categorie={categorie}
              onEdit={() => {
                setSelectedCategory(categorie);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setSelectedCategory(categorie);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <NotFound message='The Host Categories are not found' />
      )}

      <EditCategoryDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        category={selectedCategory}
        token={token}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
          setIsEditDialogOpen(false);
        }}
        toast={toast}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title='Delete Host Category'
        description={`Are you sure you want to delete ${selectedCategory?.name}?`}
        onConfirm={handleDelete}
      />
      <AddCategoryDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
}
