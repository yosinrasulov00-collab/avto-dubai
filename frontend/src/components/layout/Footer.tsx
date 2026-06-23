'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { getSettings } from '@/lib/api';
import { getSiteName } from '@/lib/site';
import type { Settings } from '@/types';

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer id="contacts" className="bg-dark-card border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-gradient-gold mb-4">
              {getSiteName(settings.site_name)}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              {settings.about_text || 'Премиальные автомобили из ОАЭ с полным сопровождением сделки.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold mb-4">Контакты</h4>
            <div className="space-y-3">
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm">
                  <Phone className="w-4 h-4 text-gold" />
                  {settings.phone}
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm">
                  <Mail className="w-4 h-4 text-gold" />
                  {settings.email}
                </a>
              )}
              {settings.address && (
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  {settings.address}
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold mb-4">Навигация</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-white/60 hover:text-gold transition-colors text-sm">Главная</Link>
              <Link href="/catalog" className="block text-white/60 hover:text-gold transition-colors text-sm">Каталог</Link>
              <Link href="/admin" className="block text-white/60 hover:text-gold transition-colors text-sm">Админ-панель</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border text-center text-white/30 text-sm">
          {settings.footer_text || '© 2026 Авто Дубай Кхори. Все права защищены.'}
        </div>
      </div>
    </footer>
  );
}
