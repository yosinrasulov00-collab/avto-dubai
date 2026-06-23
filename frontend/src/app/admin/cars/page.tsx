'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import { authFetchJson, formatPrice, getImageUrl, getStatusLabel } from '@/lib/api';
import type { Car } from '@/types';
import clsx from 'clsx';

export default function AdminCarsPage() {
  const { token } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = () => {
    if (!token) return;
    authFetchJson<{ cars: Car[] }>('/cars?limit=100', token)
      .then((data) => setCars(data.cars))
      .finally(() => setLoading(false));
  };

  useEffect(loadCars, [token]);

  const handleDelete = async (id: string, title: string) => {
    if (!token || !confirm(`Удалить "${title}"?`)) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadCars();
  };

  const toggleStatus = async (car: Car) => {
    if (!token) return;
    const newStatus = car.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${car.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    loadCars();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">Автомобили</h1>
          <p className="text-white/40 mt-1">{cars.length} автомобилей</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark text-sm font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Добавить
        </Link>
      </div>

      {loading ? (
        <p className="text-white/40">Загрузка...</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-dark-border text-white/40 text-left">
                <th className="pb-3 pr-4">Фото</th>
                <th className="pb-3 pr-4">Название</th>
                <th className="pb-3 pr-4">Цена</th>
                <th className="pb-3 pr-4">Год</th>
                <th className="pb-3 pr-4">Статус</th>
                <th className="pb-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <div className="relative w-16 h-10 overflow-hidden">
                      {car.images[0] && (
                        <Image src={getImageUrl(car.images[0])} alt="" fill className="object-cover" sizes="64px" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-white">{car.title}</td>
                  <td className="py-3 pr-4 text-gold">{formatPrice(car.price, car.currency || 'USD')}</td>
                  <td className="py-3 pr-4 text-white/60">{car.year}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => toggleStatus(car)}
                      className={clsx(
                        'px-2 py-1 text-xs uppercase',
                        car.status === 'AVAILABLE'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      )}
                    >
                      {getStatusLabel(car.status)}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/cars/${car.id}`} className="p-2 text-white/40 hover:text-gold">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(car.id, car.title)} className="p-2 text-white/40 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
