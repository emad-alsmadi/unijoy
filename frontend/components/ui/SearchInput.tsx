import { Search } from 'lucide-react';
import { Input } from './input';

interface TypeProps {
  name: string | null;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  setCurrentPage: (number: Number) => void;
}
const SearchInput = ({
  name,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
}: TypeProps) => {
  return (
    <div className='relative flex-1 max-w-full'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <Search className='h-5 w-5 text-purple-400' />
      </div>
      <Input
        placeholder={`Search ${name}`}
        className='
          pl-10 pr-4 py-2 w-full rounded-full outline-none
          bg-gradient-to-r from-purple-50 via-white to-pink-50
          border border-purple-200/60 shadow-sm
          placeholder:text-purple-300 text-gray-800
          focus:border-purple-400 focus:ring-2 focus:ring-purple-300/60 focus:ring-offset-0
          transition-all duration-300
        '
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default SearchInput;
