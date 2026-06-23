'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Car, FileText, Settings, Users, LogOut, Menu, X, KeyRound,
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from './AuthProvider';

const navItems = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/cars', label: 'Автомобили', icon: Car },
  { href: '/admin/orders', label: 'Заявки', icon: FileText },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
  { href: '/admin/users', label: 'Пользователи', icon: Users, superAdmin: true },
  { href: '/admin/profile', label: 'Профиль', icon: KeyRound },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-card border border-dark-border text-gold"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col bg-dark-card border-r border-dark-border transform transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-dark-border shrink-0">
          <Link href="/admin" className="font-[family-name:var(--font-display)] text-xl text-gradient-gold">
            Админ-панель
          </Link>
          <p className="text-white/30 text-xs mt-1">{user?.username}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            if (item.superAdmin && user?.role !== 'SUPER_ADMIN') return null;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  active ? 'bg-gold/10 text-gold border-l-2 border-gold' : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 p-4 border-t border-dark-border">
          <Link href="/" className="block text-white/30 text-xs mb-3 hover:text-gold">← На сайт</Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-400/70 hover:text-red-400 text-sm w-full px-4 py-2"
          >
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
