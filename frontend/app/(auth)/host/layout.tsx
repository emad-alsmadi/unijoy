'use client';
<<<<<<< HEAD
import { useState } from 'react';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import DashboardHeader from '@/components/ui/DashboardHeader';
import { motion } from 'framer-motion';

const HostLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
=======
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './dashboard/Header';
import HostSidebar from '@/components/sidebars/HostSidebar';

const HostLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* السايدبار */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="w-64 relative bg-gradient-to-r from-purple-800 to-pink-700 text-white shadow-xl"
                    >
                        <HostSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* المحتوى الرئيسي */}
            <div className="flex-1 overflow-y-auto">
                <Header sidebarOpen={sidebarOpen}  setSidebarOpen={setSidebarOpen}/>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default HostLayout;
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
