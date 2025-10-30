'use client';
<<<<<<< HEAD
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/type';
import Cookies from 'js-cookie';
=======
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

export type UserRole = 'user' | 'host' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  token: string;
  userRole: UserRole;
  setUserId: (userId: string) => void;
  login: (role: Exclude<UserRole, null>, token: string, userId: string) => void;
  logout: () => void;
<<<<<<< HEAD
  detailsProfile?: UserProfile;
=======
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

<<<<<<< HEAD
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [token, setToken] = useState('');
  const [detailsProfile, setDetailsProfile] = useState<UserProfile>();
=======
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [token, setToken] = useState('');
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40

  const setUserId = (userId: string) => {
    Cookies.set('userId', userId);
  };
<<<<<<< HEAD
  const login = (role: UserRole, token: string, userId: string) => {
=======
  const login = (
    role: Exclude<UserRole, null>,
    token: string,
    userId: string
  ) => {
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
    setToken(token);
    Cookies.set('token', token, { expires: 7 }); // expires after 7 days
    Cookies.set('userId', userId, { expires: 7 });
    setUserRole(role);
    Cookies.set('userRole', role, { expires: 7 });
    setIsAuthenticated(true);
  };
  useEffect(() => {
    const tokenFromCookies = Cookies.get('token');
    const roleFromCookies = Cookies.get('userRole') as UserRole;

    if (tokenFromCookies) {
      setIsAuthenticated(true);
      setToken(tokenFromCookies);
      setUserRole(roleFromCookies);
    }
  }, []);

<<<<<<< HEAD
  const fetchDetailsProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8080/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setDetailsProfile(data.user);
      console.log("profial :", data.user);  
      } catch (error: any) {
      // Handle connection errors or unexpected errors.
      toast({
        title: 'Error loading profile',
        description: error?.message || 'An unexpected error occurred.',
        className: 'bg-red-600 text-white border-0',
      });
    }
  };
  useEffect(() => {
    if (token) {
      fetchDetailsProfile();
    }
  }, [token]);

=======
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('userRole');
    setUserRole(null);
    setIsAuthenticated(false);
    setToken('');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        token,
        login,
        logout,
        setUserId,
<<<<<<< HEAD
        detailsProfile,
=======
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
