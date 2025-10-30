import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, paginate }:any) => {
  return (
    <div className='flex justify-center mt-12'>
      <nav className='flex items-center gap-2'>
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-purple-500/20'
          }`}
        >
          <ChevronLeft className='text-purple-400' />
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center
                                                        ${
                                                          currentPage ===
                                                          index + 1
                                                            ? 'bg-purple-600 text-white'
                                                            : 'text-purple-400 hover:bg-purple-500/20'
                                                        } `}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-purple-500/20'
          } `}
        >
          <ChevronRight className='text-purple-400' />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
