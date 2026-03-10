'use client';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { links } from '@/constants/index';
import SocialMedia from '../ui/SocialMedia';
import { useOutSidClick } from '@/hooks/useOutsideClick';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const Sidebar = ({ isOpen, onClose }: Props) => {
  const { userRole, isAuthenticated } = useAuth();
  const sidebarRef = useOutSidClick<HTMLDivElement>(onClose);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[2147483647] flex items-stretch bg-gradient-to-br from-black/80 via-purple-900/60 to-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-auto w-screen h-screen ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: -320, opacity: 1 }}
        animate={{ x: isOpen ? 0 : -320, opacity: 1 }}
        transition={{ duration: 0.3 }}
        ref={sidebarRef}
        onClick={(e) => e.stopPropagation()}
        className='w-72 md:w-96 bg-purple-700/95 text-white/90 h-full p-10 border-r border-white/20 flex flex-col gap-6 shadow-xl'
      >
        <div className='flex items-center justify-between'>
          <button
            className='hover:text-red-500 hoverEffect'
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <div className='flex flex-col gap-2 text-base font-semibold tracking-wide'>
          {links.map((link) => (
            <Link
              className='block w-full rounded-lg px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors'
              key={link.id}
              href={link.url}
            >
              {link?.title}
            </Link>
          ))}
        </div>
        <SocialMedia className='gap-2 md:gap-3.5' />
        {/* Login and registration buttons based on role and login status */}
        <div className='flex flex-col items-start justify-between'>
          {isAuthenticated ? (
            <Link
              href='/auth/logout'
              className='text-white px-6 py-3 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl font-semibold border-none rounded-lg transition-all duration-300'
            >
              Logout
            </Link>
          ) : (
            <>
              {(userRole === 'host' ||
                userRole === 'user' ||
                userRole === 'admin') && (
                <Link
                  href='/auth/login'
                  className='px-4 py-2 text-base md:text-sm lg:text-lg hover:text-white hoverEffect'
                >
                  Login
                </Link>
              )}
              <Link
                href='/auth/signup/host'
                className='px-4 py-2 text-base md:text-sm lg:text-lg hoverEffect hover:text-white'
              >
                Register Host
              </Link>
              <Link
                href='/auth/signup/user'
                className='px-4 py-2 text-base md:text-sm lg:text-lg hoverEffect hover:text-white'
              >
                Register User
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

export default Sidebar;
