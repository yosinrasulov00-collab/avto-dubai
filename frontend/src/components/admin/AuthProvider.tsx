'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { login as apiLogin, authFetchJson } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      authFetchJson<User>('/auth/me', saved)
        .then((u) => {
          setToken(saved);
          setUser(u);
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [loading, token, pathname, router]);

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    localStorage.setItem('admin_token', data.token);
    setToken(data.token);
    setUser(data.user);
    router.push('/admin');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
