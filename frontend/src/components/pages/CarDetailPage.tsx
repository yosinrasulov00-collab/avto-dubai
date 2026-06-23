'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, Gauge, Palette, Fuel, Settings2, ArrowLeft,
  MessageCircle, Send,
} from 'lucide-react';
import OrderForm from '@/components/forms/OrderForm';
import { getCar, getSettings, formatPrice, formatMileage, getImageUrl, getStatusLabel } from '@/lib/api';
import type { Car, Settings } from '@/types';
import clsx from 'clsx';

interface Props {
  slug: string;
}

export default function CarDetailPage({ slug }: Props) {
  const [car, setCar] = useState<Car | null>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      getCar(slug).catch(() => { setError(true); return null; }),
      getSettings().catch(() => ({})),
    ]).then(([c, s]) => {
      if (c) setCar(c);
      setSettings(s);
    });
  }, [slug]);

  if (error) {
    return (
      <div className="pt-32 pb-16 text-center">
        <h1 className="text-2xl text-white mb-4">Автомобиль не найден</h1>
        <Link href="/catalog" className="text-gold hover:underline">← Вернуться в каталог</Link>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="aspect-[16/9] bg-dark-card mb-8" />
          <div className="h-8 bg-dark-card w-1/2 mb-4" />
          <div className="h-4 bg-dark-card w-1/3" />
        </div>
      </div>
    );
  }

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует ${car.title}`)}`
    : '#';
  const telegramUrl = settings.telegram
    ? `https://t.me/${settings.telegram}`
    : '#';

  const specs = [
    { icon: Calendar, label: 'Год', value: String(car.year) },
    { icon: Gauge, label: 'Пробег', value: formatMileage(car.mileage) },
    { icon: Palette, label: 'Цвет', value: car.color },
    { icon: Settings2, label: 'Двигатель', value: car.engine },
    { icon: Settings2, label: 'Коробка', value: car.transmission },
    { icon: Fuel, label: 'Топливо', value: car.fuelType },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[16/10] overflow-hidden border border-dark-border mb-4"
            >
              <Image
                src={getImageUrl(car.images[activeImage] || car.images[0])}
                alt={car.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
              <span
                className={clsx(
                  'absolute top-4 right-4 px-3 py-1 text-xs uppercase tracking-wider',
                  car.status === 'AVAILABLE'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                )}
              >
                {getStatusLabel(car.status)}
              </span>
            </motion.div>

            {car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={clsx(
                      'relative w-24 h-16 shrink-0 overflow-hidden border-2 transition-colors',
                      activeImage === i ? 'border-gold' : 'border-dark-border hover:border-gold/50'
                    )}
                  >
                    <Image src={getImageUrl(img)} alt="" fill className="object-cover" sizes="96px" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-white mb-4">Описание</h2>
              <p className="text-white/60 leading-relaxed">{car.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-white mb-2">
                {car.title}
              </h1>
              <p className="text-3xl font-semibold text-gradient-gold mb-6">
                {formatPrice(car.price, car.currency || 'USD')}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {specs.map((s) => (
                  <div key={s.label} className="bg-dark-card border border-dark-border p-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
                      <s.icon className="w-3 h-3 text-gold" />
                      {s.label}
                    </div>
                    <p className="text-white text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-6">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[#0088cc] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" /> Telegram
                </a>
              </div>
            </motion.div>

            <OrderForm carId={car.id} carTitle={car.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
