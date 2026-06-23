'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, FileText, DollarSign, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import { authFetchJson } from '@/lib/api';
import type { Car as CarType, Order } from '@/types';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ cars: 0, available: 0, sold: 0, orders: 0, newOrders: 0 });

  useEffect(() => {
    if (!token) return;
    Promise.all([
      authFetchJson<{ cars: CarType[]; total: number }>('/cars?limit=100', token),
      authFetchJson<Order[]>('/orders', token),
    ]).then(([carsData, orders]) => {
      setStats({
        cars: carsData.total,
        available: carsData.cars.filter((c) => c.status === 'AVAILABLE').length,
        sold: carsData.cars.filter((c) => c.status === 'SOLD').length,
        orders: orders.length,
        newOrders: orders.filter((o) => o.status === 'NEW').length,
      });
    }).catch(() => {});
  }, [token]);

  const cards = [
    { label: 'Всего авто', value: stats.cars, icon: Car, href: '/admin/cars', color: 'text-gold' },
    { label: 'В наличии', value: stats.available, icon: CheckCircle, href: '/admin/cars', color: 'text-green-400' },
    { label: 'Продано', value: stats.sold, icon: DollarSign, href: '/admin/cars', color: 'text-red-400' },
    { label: 'Новые заявки', value: stats.newOrders, icon: FileText, href: '/admin/orders', color: 'text-blue-400' },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-white mb-2">Дашборд</h1>
      <p className="text-white/40 mb-8">Обзор Авто Дубай Кхори</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-dark-card border border-dark-border p-6 hover:border-gold/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-3xl font-semibold text-white">{card.value}</span>
            </div>
            <p className="text-white/40 text-sm">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="bg-dark-card border border-dark-border p-6">
          <h2 className="text-white font-medium mb-4">Быстрые действия</h2>
          <div className="space-y-2">
            <Link href="/admin/cars/new" className="block px-4 py-3 bg-gold/10 text-gold text-sm hover:bg-gold/20 transition-colors">
              + Добавить автомобиль
            </Link>
            <Link href="/admin/orders" className="block px-4 py-3 bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors">
              Просмотреть заявки ({stats.orders})
            </Link>
            <Link href="/admin/settings" className="block px-4 py-3 bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors">
              Настройки сайта
            </Link>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border p-6">
          <h2 className="text-white font-medium mb-4">Информация</h2>
          <div className="space-y-3 text-sm text-white/50">
            <p>Добро пожаловать в панель управления Авто Дубай Кхори.</p>
            <p>Здесь вы можете управлять автомобилями, заявками, настройками сайта и пользователями.</p>
            <p className="text-gold/70">⚠ Рекомендуем сменить пароль по умолчанию в разделе «Профиль».</p>
          </div>
        </div>
      </div>
    </div>
  );
}
