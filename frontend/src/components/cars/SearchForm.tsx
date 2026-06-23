'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import type { FilterOptions } from '@/types';

interface SearchFormProps {
  filters?: FilterOptions;
  compact?: boolean;
}

export default function SearchForm({ filters, compact }: SearchFormProps) {
  const router = useRouter();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [mileageMax, setMileageMax] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (priceMax) params.set('priceMax', priceMax);
    if (yearMin) params.set('yearMin', yearMin);
    if (mileageMax) params.set('mileageMax', mileageMax);
    router.push(`/catalog?${params.toString()}`);
  };

  const inputClass =
    'w-full bg-dark-card border border-dark-border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none transition-colors [color-scheme:dark]';

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass p-6 ${compact ? '' : 'lg:p-8'} gold-glow`}
    >
      <div className={`grid gap-4 ${compact ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'}`}>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Марка</label>
          {filters?.brands.length ? (
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass}>
              <option value="">Все марки</option>
              {filters.brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          ) : (
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Mercedes-Benz" className={inputClass} />
          )}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Модель</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="S-Class" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Цена до ($)</label>
          <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="200000" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Год от</label>
          <input type="number" value={yearMin} onChange={(e) => setYearMin(e.target.value)} placeholder="2020" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Пробег до (км)</label>
          <input type="number" value={mileageMax} onChange={(e) => setMileageMax(e.target.value)} placeholder="50000" className={inputClass} />
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity"
      >
        <Search className="w-4 h-4" />
        Найти автомобиль
      </button>
    </form>
  );
}
