'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Car } from 'lucide-react';
import clsx from 'clsx';
import { getSettings } from '@/lib/api';
import { splitSiteName } from '@/lib/site';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/#contacts', label: 'Контакты' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [siteName, setSiteName] = useState('');
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    getSettings()
      .then((s) => setSiteName(s.site_name || ''))
      .catch(() => {});
  }, []);

  if (isAdmin) return null;

  const { primary, secondary } = splitSiteName(siteName);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center gold-glow">
              <Car className="w-5 h-5 text-dark" />
            </div>
            <div>
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-gradient-gold">
                {primary}
              </span>
              {secondary && (
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {secondary}
                </span>
              )}
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-sm uppercase tracking-wider transition-colors hover:text-gold',
                  pathname === link.href ? 'text-gold' : 'text-white/70'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/catalog"
            className="hidden md:inline-flex px-6 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Каталог
          </Link>

          <button
            className="md:hidden p-2 text-white/70 hover:text-gold"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-dark/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-wider text-white/70 hover:text-gold py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
