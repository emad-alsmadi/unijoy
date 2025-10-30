'use client';
import { useState } from 'react';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import DashboardHeader from '@/components/ui/DashboardHeader';
import { motion } from 'framer-motion';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='relative min-h-screen bg-gray-50'>
      {/* Sidebar mounts itself fixed; no wrapper needed to avoid blocking content */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content area with animated left margin on desktop only */}
      <motion.div
        className='overflow-y-auto scrollbar-hide'
        initial={false}
        animate={{
          marginLeft: typeof window === 'undefined' ? 0 : undefined,
        }}
        // Use a function to compute responsive margin left. On mobile, no shift. On lg+, shift between 4rem and 16rem
        style={{}}
      >
        <div
          className='transition-[margin] duration-500 ease-out'
          style={{
            marginLeft:
              typeof window !== 'undefined' &&
              window.matchMedia('(min-width: 1024px)').matches
                ? sidebarOpen
                  ? '16rem'
                  : '4rem'
                : '0rem',
          }}
        >
          <DashboardHeader />
          <main>{children}</main>
        </div>
      </motion.div>
    </div>
  );
};
export default AdminLayout;
