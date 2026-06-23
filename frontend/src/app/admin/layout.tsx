'use client';

import { AuthProvider } from '@/components/admin/AuthProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/admin/AuthProvider';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const isLogin = pathname === '/admin/login';

  if (loading && !isLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-gold animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (isLogin) {
    return <div className="min-h-screen bg-dark">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-dark">
      <AdminSidebar />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto lg:ml-64 pt-14 lg:pt-0">
        <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
