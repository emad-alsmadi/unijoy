'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Container from './Container';
import dynamic from 'next/dynamic';
const HeaderMenu = dynamic(() => import('../home/HeaderMenu'));
const MobileMenu = dynamic(() => import('../home/MobileMenu'));
import srcImage from '@/public/images/logo.jpg';
import { Search } from 'lucide-react';
const ProfileDropdown = dynamic(
  () => import('./ProfileDropdown').then((m) => m.ProfileDropdown),
  {
    ssr: false,
  }
);
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header = () => {
  const { token, userRole, detailsProfile } = useAuth();

  const pathname = usePathname();
  const hiddeHeaderPaths = ['/admin', '/host'];
  const shouldhideHeader = hiddeHeaderPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      {!shouldhideHeader && (
        <header className={`relative pb-2 z-[999]  top-0`}>
          <div className='px-4 md:px-11 p-2 h-auto md:h-18 flex flex-wrap items-center justify-between gap-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-600 text-white/90 shadow-sm border-b border-white/10 backdrop-blur-md dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'>
            <div className='flex items-center gap-2 text-white/80'>
              <Search className='w-5 h-5' />
            </div>
            {!token && (
              <Link
                href='/auth/login'
                className='hidden md:block px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200'
              >
                Login
              </Link>
            )}
            {userRole && (
              <Link
                href={`/${userRole}/events`}
                className='p-3 text-base font-sans font-semibold hidden md:block text-white/80 hover:text-white transition-colors'
              >
                Dashboard {userRole}
              </Link>
            )}
            <p className='text-sm md:text-base font-sans font-normal text-white/70 hover:text-white transition-colors flex-1 text-center md:text-start'>
              Book an event now
            </p>
            <h1 className='text-sm md:text-base font-sans font-normal text-white/80 text-center md:text-start'>
              Welcome to our platform ...{' '}
              <span className='hover:text-white transition-colors font-semibold'>
                {' '}
                Do you want to know the latest events ?
              </span>
            </h1>
            <div className='flex items-center'>
              <ThemeToggle />
            </div>
          </div>

          {/* القائمة الرئيسية */}
          <div className='flex flex-wrap items-center justify-between gap-5 text-lightColor bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 border-b border-black/5 shadow-[0_8px_20px_-12px_rgba(91,33,182,0.25)] dark:bg-slate-900/70 dark:supports-[backdrop-filter]:bg-slate-900/60 dark:border-white/10 px-6 mx-4'>
            {/* Logo */}
            <div className='flex justify-center md:justify-start items-center ms-2 lg:ms-4'>
              <Image
                width={90}
                height={50}
                src={srcImage}
                alt='logo'
              />
              <h1 className='ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-500 font-bold text-xl lg:text-3xl text-center md:text-end'>
                UniJoy
                <br />
              </h1>
            </div>

            {/* قائمة التنقل الرئيسية */}
            <div className='w-full md:w-auto flex flex-1 justify-center md:justify-end lg:gap-4'>
              <HeaderMenu />
            </div>

            {/* القائمة الجانبية للجوال */}
            <div className='block md:hidden'>
              <MobileMenu />
            </div>
            {/* Login and registration buttons based on role and login status */}
            <div className='w-auto flex items-center justify-end md:gap-5 lg:gap-6'>
              {token ? (
                <ProfileDropdown
                  user={detailsProfile?.name}
                  userRole={`${userRole}`}
                  //user={{ name: profileInfo.name, profileImage: '/avatar.jpg' }}
                />
              ) : (
                <>
                  <Link
                    href='/auth/login'
                    className='hidden md:block bg-gradient-to-r from-indigo-600 to-purple-600 text-white md:px-6 py-3 px-4 sm:py-2 text-base md:text-sm lg:text-lg rounded-full shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all duration-300'
                  >
                    Login
                  </Link>
                  <Link
                    href='/auth/signup/user'
                    className='hidden md:block bg-white/90 px-4 py-2 text-base md:text-sm lg:text-lg font-semibold border border-black/10 rounded-full hover:bg-white shadow-sm hover:shadow-md text-black transition-all duration-300'
                  >
                    Register User
                  </Link>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}
    </>
  );
};
export default Header;
