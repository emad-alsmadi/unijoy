'use client';
import { ChevronDown, Bell, Home, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

type DashboardHeaderProps = {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
};

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps) => {
  const { userRole, detailsProfile } = useAuth();

  return (
    <header className='bg-white shadow-sm z-10 m-4'>
      <div className='flex items-center justify-between py-4 px-8'>
        <div className='flex items-center gap-2'>
          {/* Mobile hamburger to open sidebar */}
          <button
            type='button'
            aria-label='Open sidebar'
            onClick={() => setSidebarOpen?.(true)}
            className='lg:hidden p-2 rounded-md hover:bg-gray-100'
          >
            <Menu className='w-6 h-6 text-gray-600' />
          </button>
          <Link
            href={`/`}
            className={` hover:bg-gray-100`}
          >
            <Home className='w-6 h-6 text-gray-500 group-hover:text-white transition-colors flex-shrink-0' />
          </Link>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <button className='p-2 rounded-full hover:bg-gray-100 relative'>
              <Bell className='text-gray-600 w-5 h-5' />
              <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>
          </div>
          <div className='flex items-center space-x-2'>
            <Link
              href={'/profile'}
              className='w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center'
            >
              {' '}
              <span className='text-indigo-800 font-medium'>
                {detailsProfile?.name[0]}
              </span>
            </Link>

            <div>
              <p className='text-sm font-medium'>{detailsProfile?.name}</p>
              {userRole === 'host' ? (
                <p className='text-xs text-gray-500'>
                  {detailsProfile?.hostCategory}
                </p>
              ) : (
                <></>
              )}
            </div>
            <ChevronDown className='text-gray-500 w-5 h-5' />
          </div>
        </div>
      </div>
    </header>
  );
};
export default DashboardHeader;
