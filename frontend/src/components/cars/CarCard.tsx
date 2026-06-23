'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Gauge, Palette } from 'lucide-react';
import { Car } from '@/types';
import { formatPrice, formatMileage, getImageUrl, getStatusLabel } from '@/lib/api';
import clsx from 'clsx';

interface CarCardProps {
  car: Car;
  index?: number;
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  const imageUrl = car.images[0] ? getImageUrl(car.images[0]) : '/placeholder-car.jpg';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/catalog/${car.slug}`} className="block">
        <div className="relative overflow-hidden bg-dark-card border border-dark-border hover:border-gold/40 transition-all duration-500 gold-glow hover:gold-glow">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={imageUrl}
              alt={car.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
            <span
              className={clsx(
                'absolute top-4 right-4 px-3 py-1 text-xs uppercase tracking-wider font-medium',
                car.status === 'AVAILABLE'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              )}
            >
              {getStatusLabel(car.status)}
            </span>
          </div>

          <div className="p-5">
            <h3 className="font-[family-name:var(--font-display)] text-lg text-white group-hover:text-gold transition-colors mb-2">
              {car.title}
            </h3>
            <p className="text-2xl font-semibold text-gradient-gold mb-4">
              {formatPrice(car.price, car.currency || 'USD')}
            </p>
            <div className="flex flex-wrap gap-4 text-white/50 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                {car.year}
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-gold" />
                {formatMileage(car.mileage)}
              </span>
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-gold" />
                {car.color}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
