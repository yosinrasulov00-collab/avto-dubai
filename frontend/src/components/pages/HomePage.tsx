'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import SearchForm from '@/components/cars/SearchForm';
import CarCard from '@/components/cars/CarCard';
import OrderForm from '@/components/forms/OrderForm';
import { getFeaturedCars, getSettings, getBanner, getFilterOptions } from '@/lib/api';
import { getImageUrl } from '@/lib/api';
import { getSiteName } from '@/lib/site';
import type { Car, Settings, Banner, FilterOptions } from '@/types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Car[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [banner, setBanner] = useState<Banner | null>(null);
  const [filters, setFilters] = useState<FilterOptions | undefined>();

  useEffect(() => {
    Promise.all([
      getFeaturedCars().catch(() => []),
      getSettings().catch(() => ({})),
      getBanner().catch(() => null),
      getFilterOptions().catch(() => undefined),
    ]).then(([cars, sett, ban, filt]) => {
      setFeatured(cars);
      setSettings(sett);
      setBanner(ban);
      setFilters(filt);
    });
  }, []);

  const siteName = getSiteName(settings.site_name);
  const heroTitle = settings.hero_title || banner?.title || siteName;
  const heroSubtitle = settings.hero_subtitle || banner?.subtitle || 'Лучшие цены на автомобили из ОАЭ';
  const bgImage = banner?.imageUrl
    ? getImageUrl(banner.imageUrl)
    : settings.hero_background || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80';

  const features = [
    { icon: Shield, title: 'Гарантия качества', desc: 'Проверенные автомобили с полной историей' },
    { icon: Truck, title: 'Доставка', desc: 'Организуем доставку в любую точку мира' },
    { icon: HeadphonesIcon, title: 'Поддержка 24/7', desc: 'Персональный менеджер на всех этапах' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={bgImage}
            alt="Dubai skyline"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-gold uppercase tracking-[0.4em] text-sm mb-4">{siteName}</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <SearchForm filters={filters} />
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gold rounded-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8 border border-dark-border hover:border-gold/30 transition-colors"
              >
                <f.icon className="w-10 h-10 text-gold mx-auto mb-4" />
                <h3 className="font-[family-name:var(--font-display)] text-lg text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-xs mb-2">Избранное</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-white">
                Популярные автомобили
              </h2>
            </div>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-2 text-gold text-sm uppercase tracking-wider hover:gap-3 transition-all"
            >
              Весь каталог <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-12">Автомобили загружаются...</p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-wider">
              Весь каталог <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Order + Map */}
      <section className="py-20 bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-xs mb-2">Связаться</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-6">
                Оставьте заявку
              </h2>
              <OrderForm />
            </div>
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-xs mb-2">Локация</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-6">
                Мы в Дубае
              </h2>
              <div className="aspect-[4/3] border border-dark-border overflow-hidden">
                <iframe
                  title="Dubai location"
                  src={`https://maps.google.com/maps?q=${settings.map_lat || '25.2048'},${settings.map_lng || '55.2708'}&z=14&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
