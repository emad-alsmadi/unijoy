import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
export function ProfileDropdown({
  user,
  userRole,
}: {
  user: { name?: string; className?: string };
  userRole: string;
}) {
  const router = useRouter();
<<<<<<< HEAD
  const { logout, detailsProfile } = useAuth();
=======
  const {logout} = useAuth();
  const handleLogout = () => {
    logout();
  };
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='w-10 h-10 rounded-full overflow-hidden border-2 border-purple-600 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition'>
          <User className='text-purple-600 w-full h-full p-2' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='z-[999] w-48 mt-2 shadow-lg bg-white border border-gray-200 rounded-xl text-sm'>
        <div className='px-3 py-2'>
<<<<<<< HEAD
          <p className='font-medium text-gray-800'>{detailsProfile?.name}</p>
=======
          <p className='font-medium text-gray-800'>{user?.name || 'Guest'}</p>
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer hover:bg-gray-100'
          onClick={() => router.push('/profile')}
        >
          <User className='w-4 h-4 mr-2 text-purple-600' /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer hover:bg-gray-100'
<<<<<<< HEAD
          onClick={() => router.push(`/${userRole}/events`)}
=======
          onClick={() => router.push(`/${userRole}/dashboard`)}
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
        >
          <Settings className='w-4 h-4 mr-2 text-purple-600' /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer text-red-600 hover:bg-red-50'
<<<<<<< HEAD
          onClick={logout}
=======
          onClick={handleLogout}
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
        >
          <LogOut className='w-4 h-4 mr-2' /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
