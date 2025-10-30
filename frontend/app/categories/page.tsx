'use client';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
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
import { fetchCategories } from '@/lib/api/hostCategories';
import CategorieCard from '@/components/ui/CategorieCard';
import Pagination from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/Loading';

const HostCategoriesPage = () => {
  const [categories, setCategories] = useState<HostCategory[]>([]);
  const [filtered, setFiltered] = useState<HostCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1); // حالة Pagination الجديدة
  const [categoriesPerPage] = useState(6); // عدد الأحداث في كل صفحة
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories(
      setLoading,
      toast,
      currentPage,
      categoriesPerPage,
      true
    ).then((data) => {
      console.log('data.categories', data.categories);
      if (data && Array.isArray(data.categories))
        setCategories(data.categories);
      else setCategories([]);
    });
  }, [currentPage]);

  useEffect(() => {
    let temp = categories;
    if (activeFilter !== 'all') {
      temp = temp?.filter((c) => c.name === activeFilter);
    }
    if (debouncedQuery?.trim()) {
      temp = temp?.filter(
        (c) =>
          c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    setFiltered(temp);
  }, [debouncedQuery, activeFilter, categories]);

  const uniqueFilters = [
    'all',
    ...Array.from(new Set(categories?.map((c) => c.name))),
  ];

  // حساب الأحداث للصفحة الحالية
  const indexOfLastEvent = currentPage * categoriesPerPage;
  const indexOfFirstEvent = indexOfLastEvent - categoriesPerPage;
  const currentHostCategories = filtered?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filtered?.length / categoriesPerPage);

  // تغيير الصفحة
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <motion.div
          className='p-6 space-y-10 bg-gradient-to-tr from-purple-100 via-white to-blue-100 min-h-screen'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Search & Filter */}
          <motion.div
            className='flex flex-col md:flex-row justify-between items-center gap-4'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Search Input */}
            <SearchInput
              name='Categories Host'
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
                    onClick={() => setActiveFilter(filter)}
                    className='capitalize cursor-pointer hover:bg-purple-100'
                  >
                    {filter}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
          {/* Cards Section */}
          {currentHostCategories?.length > 0 ? (
            <>
              {' '}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
                {currentHostCategories.length > 0 ? (
                  currentHostCategories.map((categorie, index) => (
                    <CategorieCard
                      key={categorie._id}
                      index={index}
                      categorie={categorie}
                    />
                  ))
                ) : (
                  <NotFound message='No categories available' />
                )}
              </div>
              {/* Pagination Controls */}
              {filtered.length > 0 && (
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
};
export default HostCategoriesPage;
