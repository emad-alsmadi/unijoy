'use client';

import { useDebounce } from 'use-debounce';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HostCategory } from '@/types';
import SearchInput from '@/components/ui/SearchInput';
import NotFound from '@/components/ui/NotFound';
import CategorieCard from '@/components/ui/CategorieCard';
import Pagination from '@/components/ui/pagination';
import { Loading } from '@/components/ui/Loading';

export default function CategoriesClient({
  initialCategories,
}: {
  initialCategories: HostCategory[];
}) {
  const [categories, setCategories] = useState<HostCategory[]>(
    initialCategories || [],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6;

  useEffect(() => {
    setCategories(initialCategories || []);
  }, [initialCategories]);

  const filtered = useMemo(() => {
    let temp = categories;
    if (activeFilter !== 'all') {
      temp = temp?.filter((c) => c.name === activeFilter);
    }
    if (debouncedQuery?.trim()) {
      temp = temp?.filter(
        (c) =>
          c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(debouncedQuery.toLowerCase()),
      );
    }
    return temp;
  }, [debouncedQuery, activeFilter, categories]);

  const uniqueFilters = [
    'all',
    ...Array.from(new Set((categories || [])?.map((c) => c.name))),
  ];

  const totalPages = Math.ceil((filtered?.length || 0) / categoriesPerPage);

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentHostCategories = (filtered || []).slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      {!categories ? (
        <Loading />
      ) : (
        <motion.div
          className='p-6 space-y-10 bg-gradient-to-tr from-purple-100 via-white to-blue-100 min-h-screen'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='flex flex-col md:flex-row justify-between items-center gap-4'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <SearchInput
              name='Categories Host'
              searchQuery={searchQuery}
              setSearchQuery={(v) => {
                setSearchQuery(v);
                setCurrentPage(1);
              }}
              setCurrentPage={() => setCurrentPage(1)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='capitalize w-full md:w-40 text-purple-700 border-purple-400 hover:bg-purple-100'
                >
                  {activeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-white border border-purple-300 rounded-lg shadow-md'>
                {uniqueFilters?.map((filter, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setActiveFilter(filter);
                      setCurrentPage(1);
                    }}
                    className='capitalize cursor-pointer hover:bg-purple-100'
                  >
                    {filter}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {currentHostCategories?.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
                {currentHostCategories.map((categorie, index) => (
                  <CategorieCard
                    key={categorie._id}
                    index={index}
                    categorie={categorie}
                  />
                ))}
              </div>
              {filtered.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  paginate={paginate}
                />
              )}
            </>
          ) : (
            <NotFound message='The Host Categores are not found' />
          )}
        </motion.div>
      )}
    </>
  );
}
