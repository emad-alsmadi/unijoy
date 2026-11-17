'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { adminSidbarItems, hostSidbarItems } from '@/constants/navItems';
import { LogOut, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback } from 'react';
import { useOutSidClick } from '@/hooks/useOutsideClick';

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { logout, userRole } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const close = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);
  const mobileRef = useOutSidClick<HTMLDivElement>(() => {
    if (sidebarOpen) close();
  });
  const desktopRef = useOutSidClick<HTMLDivElement>(() => {
    // Only close on outside click for desktop when it's expanded
    // collapse to icons-only instead of fully closing
    if (sidebarOpen) setSidebarOpen(false);
  });

  const navItems = userRole === 'admin' ? adminSidbarItems : hostSidbarItems;

  const sidebarDesktopVariants = {
    open: {
      width: '16rem',
      transition: { type: 'spring', damping: 24, stiffness: 260 },
    },
    collapsed: {
      width: '4rem',
      transition: { type: 'spring', damping: 24, stiffness: 260 },
    },
  } as const;

  const sidebarMobileVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 24, stiffness: 260 },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { type: 'spring', damping: 24, stiffness: 260 },
    },
  } as const;

  const listVariants = {
    open: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
    closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  } as const;

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -8 },
  } as const;

  return (
    <>
      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key='backdrop'
            className='fixed inset-0 lg:hidden z-40 bg-black/40 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key='mobile'
            ref={mobileRef}
            className='fixed inset-y-0 left-0 z-40 h-screen overflow-y-auto text-white ring-1 ring-white/10 bg-gradient-to-br from-purple-950/90 via-purple-900/85 to-pink-900/80 backdrop-blur-xl lg:hidden min-w-64 max-w-72 shadow-2xl'
            variants={sidebarMobileVariants}
            initial='closed'
            animate='open'
            exit='closed'
          >
            <div className='h-full flex flex-col'>
              <div className='p-4 border-b border-white/10 flex items-center justify-between'>
                <h1 className='text-lg font-semibold tracking-wide'>
                  {userRole} Dashboard
                </h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label='Close sidebar'
                  className='p-2 rounded-md hover:bg-white/10'
                >
                  <svg
                    className='w-5 h-5 text-white/80'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              <motion.nav
                className='flex-1 p-3 space-y-1'
                variants={listVariants}
                initial={false}
                animate='open'
              >
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`group flex items-center gap-3 p-3 rounded-xl transition-all ring-1 ring-white/5 hover:ring-white/10 hover:bg-white/5`}
                  >
                    <item.icon className='w-5 h-5 text-purple-200 group-hover:text-white transition-colors flex-shrink-0' />
                    <motion.span
                      className='text-purple-100 group-hover:text-white transition-colors whitespace-nowrap overflow-hidden'
                      variants={itemVariants}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                ))}
              </motion.nav>

              <div className='p-3 border-t border-white/10 mt-auto'>
                <button
                  className={`group w-full flex items-center gap-3 p-3 rounded-xl bg-white/0 hover:bg-white/5 transition-all ring-1 ring-white/5 hover:ring-white/10`}
                  onClick={handleLogout}
                >
                  <LogOut className='w-5 h-5 text-purple-200 group-hover:text-white' />
                  <motion.span
                    className='text-purple-100 group-hover:text-white'
                    variants={itemVariants}
                    initial={false}
                    animate='open'
                  >
                    Logout
                  </motion.span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop collapsible rail */}
      <motion.aside
        key='desktop'
        ref={desktopRef}
        className={
          'hidden lg:flex fixed inset-y-0 left-0 z-40 h-screen overflow-y-auto text-white shadow-2xl ring-1 ring-white/10 bg-gradient-to-br from-purple-950/90 via-purple-900/80 to-pink-900/80 backdrop-blur-xl'
        }
        initial={false}
        animate={sidebarOpen ? 'open' : 'collapsed'}
        variants={sidebarDesktopVariants}
        style={{ width: undefined }}
      >
        <div className='h-full flex flex-col w-full'>
          {sidebarOpen ? (
            <div className='p-4 border-b border-white/10'>
              <h1 className='text-lg font-semibold tracking-wide'>
                {userRole} Dashboard
              </h1>
            </div>
          ) : (
            <div className='flex items-center'>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`group flex items-center gap-3 p-6 transition-all hover:ring-white/10 hover:bg-white/5 border-b border-white/10`}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </button>
            </div>
          )}

          <motion.nav
            className='flex-1 p-3 space-y-3'
            variants={listVariants}
            initial={false}
            animate={sidebarOpen ? 'open' : 'closed'}
          >
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`group flex items-center gap-3 p-3 rounded-xl transition-all ring-1 ring-white/5 hover:ring-white/10 hover:bg-white/5`}
              >
                <item.icon className='w-5 h-5 text-purple-200 group-hover:text-white transition-colors flex-shrink-0' />
                <motion.span
                  className='text-purple-100 group-hover:text-white transition-colors whitespace-nowrap overflow-hidden'
                  variants={itemVariants}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </motion.nav>

          <div className='p-3 mb-6 border-t border-white/10 mt-auto space-y-2'>
            <Link
              href={`/profile`}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all ring-1 ring-white/5 hover:ring-white/10 hover:bg-white/5`}
            >
              <User className='w-5 h-5 text-purple-200 group-hover:text-white transition-colors flex-shrink-0' />
              <motion.span
                className='h-5 text-purple-200 group-hover:text-white transition-colors flex-shrink-0'
                variants={itemVariants}
                animate={sidebarOpen ? 'open' : 'closed'}
              >
                My Profile
              </motion.span>
            </Link>
            <button
              className={`group w-full flex items-center gap-3 p-3 rounded-xl bg-white/0 hover:bg-white/5 transition-all ring-1 ring-white/5 hover:ring-white/10`}
              onClick={handleLogout}
            >
              <LogOut className='w-5 h-5 text-purple-200 group-hover:text-white transition-colors flex-shrink-0' />
              <motion.span
                className={`w-5 h-5 text-purple-200 group-hover:text-white transition-colors flex-shrink-0`}
                variants={itemVariants}
                initial={false}
                animate={sidebarOpen ? 'open' : 'closed'}
              >
                Logout
              </motion.span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
