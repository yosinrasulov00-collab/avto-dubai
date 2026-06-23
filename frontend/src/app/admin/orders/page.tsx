'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import { authFetchJson, getStatusLabel } from '@/lib/api';
import type { Order } from '@/types';
import clsx from 'clsx';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    if (!token) return;
    authFetchJson<Order[]>('/orders', token)
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, [token]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Удалить заявку?')) return;
    await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadOrders();
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-white mb-2">Заявки</h1>
      <p className="text-white/40 mb-8">{orders.length} заявок</p>

      {loading ? (
        <p className="text-white/40">Загрузка...</p>
      ) : orders.length === 0 ? (
        <p className="text-white/40">Заявок пока нет</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-dark-card border border-dark-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-white font-medium">{order.name}</h3>
                  <p className="text-gold text-sm">{order.phone}</p>
                  {order.email && <p className="text-white/40 text-sm">{order.email}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx('px-2 py-1 text-xs uppercase', statusColors[order.status])}>
                    {getStatusLabel(order.status)}
                  </span>
                  <button onClick={() => handleDelete(order.id)} className="p-2 text-white/30 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {order.car && (
                <p className="text-white/50 text-sm mb-2">Авто: {order.car.title}</p>
              )}
              {order.message && (
                <p className="text-white/40 text-sm mb-3">{order.message}</p>
              )}
              <p className="text-white/20 text-xs mb-3">
                {new Date(order.createdAt).toLocaleString('ru-RU')}
              </p>

              <div className="flex flex-wrap gap-2">
                {(['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id, s)}
                    className={clsx(
                      'px-3 py-1 text-xs border transition-colors',
                      order.status === s
                        ? 'border-gold text-gold'
                        : 'border-dark-border text-white/30 hover:border-gold/50'
                    )}
                  >
                    {getStatusLabel(s)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
