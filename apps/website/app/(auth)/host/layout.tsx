'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import DashboardHeader from '@/components/ui/DashboardHeader';
import { motion } from 'framer-motion';

const HostLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  return (
    <div className='relative min-h-screen bg-gray-50'>
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <motion.div
        className='overflow-y-auto scrollbar-hide'
        initial={false}
        animate={{ marginLeft: typeof window === 'undefined' ? 0 : undefined }}
      >
        <div
          className='transition-[margin] duration-500 ease-out'
          style={{
            marginLeft:
              typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
                ? sidebarOpen
                  ? '16rem'
                  : '4rem'
                : '0rem',
          }}
        >
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className='p-6'>{children}</main>
        </div>
      </motion.div>
    </div>
  );
};

export default HostLayout;
