'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getAuth, loginUser } from '@/services/api/graphql';
import { usePathname, useRouter } from 'next/navigation';
import { useToastApi } from '@/hooks/useToastApi';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface User {
  email: string;
  userId: string;
  role: string;
  exp: number;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const toast = useToastApi();
  const pathname = usePathname();

  const PUBLIC_ROUTES = ['/login', '/register', '/'];

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) return;
    const loadUser = async () => {
      try {
        const user = decodeToken();

        if (!user) {
          toast.open({
            key: 'auth',
            type: 'error',
            content: 'User not logged in',
            duration: 2,
          });
          logout();
          return;
        }

        if (dayjs.unix(user.exp) < dayjs() && user) {
          toast.open({
            key: 'auth',
            type: 'error',
            content: 'User session expired. Log in again',
            duration: 2,
          });
          logout();
          return;
        }
        await getAuth(parseInt(user.userId));
        setUser(user);
        toast.open({
          key: 'auth',
          type: 'success',
          content: 'User is already logged in',
          duration: 2,
        });
      } catch (error) {
        if (error instanceof Error)
          toast.open({
            key: 'auth',
            type: 'error',
            content: error.message,
            duration: 2,
          });
        logout();
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    if (response.data) {
      localStorage.setItem('token', response.data.login.token);
      const user = decodeToken();
      setUser(user);
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getToken = () => {
  const token = localStorage.getItem('token') as string;
  return token as string;
};

export const decodeToken = () => {
  const user: User = jwtDecode(getToken());
  return user;
};
