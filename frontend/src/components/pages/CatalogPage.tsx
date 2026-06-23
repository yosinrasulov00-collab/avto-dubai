'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import CarCard from '@/components/cars/CarCard';
import CatalogFilters from '@/components/cars/CatalogFilters';
import { getCars, getFilterOptions } from '@/lib/api';
import type { Car, FilterOptions } from '@/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [options, setOptions] = useState<FilterOptions>({
    brands: [], models: [], colors: [], transmissions: [], fuelTypes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilterOptions().then(setOptions).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => { filters[key] = value; });

    getCars(filters)
      .then((data) => {
        setCars(data.cars);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const page = parseInt(searchParams.get('page') || '1');

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-gold uppercase tracking-[0.3em] text-xs mb-2">Каталог</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl lg:text-5xl text-white">
            Автомобили из Дубая
          </h1>
          <p className="text-white/50 mt-2">
            {loading ? 'Загрузка...' : `Найдено: ${total} автомобил${total === 1 ? 'ь' : total < 5 ? 'я' : 'ей'}`}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CatalogFilters options={options} />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[16/10] bg-dark-card animate-pulse border border-dark-border" />
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {cars.map((car, i) => (
                    <CarCard key={car.id} car={car} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', String(p));
                      return (
                        <a
                          key={p}
                          href={`/catalog?${params.toString()}`}
                          className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                            p === page
                              ? 'bg-gold text-dark border-gold'
                              : 'border-dark-border text-white/50 hover:border-gold/50'
                          }`}
                        >
                          {p}
                        </a>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 border border-dark-border">
                <p className="text-white/40 text-lg">Автомобили не найдены</p>
                <p className="text-white/30 text-sm mt-2">Попробуйте изменить фильтры</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-16 text-center text-white/40">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
