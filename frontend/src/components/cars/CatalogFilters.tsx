'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import type { FilterOptions } from '@/types';

interface CatalogFiltersProps {
  options: FilterOptions;
}

export default function CatalogFilters({ options }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      router.push(`/catalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => router.push('/catalog');

  const hasFilters = Array.from(searchParams.entries()).some(
    ([k]) => !['page'].includes(k)
  );

  const selectClass =
    'w-full bg-dark-card border border-dark-border px-3 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none [color-scheme:dark]';

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-gold">
          <Filter className="w-4 h-4" />
          Фильтры
        </h3>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-white/40 hover:text-gold">
            <X className="w-3 h-3" /> Сбросить
          </button>
        )}
      </div>

      <div className="space-y-4">
        <FilterSelect label="Марка" value={searchParams.get('brand') || ''} options={options.brands} onChange={(v) => updateFilter('brand', v)} className={selectClass} />
        <FilterSelect label="Модель" value={searchParams.get('model') || ''} options={options.models} onChange={(v) => updateFilter('model', v)} className={selectClass} />
        <FilterSelect label="Топливо" value={searchParams.get('fuelType') || ''} options={options.fuelTypes} onChange={(v) => updateFilter('fuelType', v)} className={selectClass} />
        <FilterSelect label="Коробка" value={searchParams.get('transmission') || ''} options={options.transmissions} onChange={(v) => updateFilter('transmission', v)} className={selectClass} />
        <FilterSelect label="Цвет" value={searchParams.get('color') || ''} options={options.colors} onChange={(v) => updateFilter('color', v)} className={selectClass} />

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Цена от ($)</label>
          <input
            type="number"
            defaultValue={searchParams.get('priceMin') || ''}
            onBlur={(e) => updateFilter('priceMin', e.target.value)}
            className={selectClass}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Цена до ($)</label>
          <input
            type="number"
            defaultValue={searchParams.get('priceMax') || ''}
            onBlur={(e) => updateFilter('priceMax', e.target.value)}
            className={selectClass}
            placeholder="500000"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Год от</label>
          <input
            type="number"
            defaultValue={searchParams.get('yearMin') || ''}
            onBlur={(e) => updateFilter('yearMin', e.target.value)}
            className={selectClass}
            placeholder="2018"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Год до</label>
          <input
            type="number"
            defaultValue={searchParams.get('yearMax') || ''}
            onBlur={(e) => updateFilter('yearMax', e.target.value)}
            className={selectClass}
            placeholder="2025"
          />
        </div>
      </div>
    </aside>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
        <option value="">Все</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
