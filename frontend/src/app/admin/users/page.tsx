'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import { authFetchJson } from '@/lib/api';
import type { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');
  const [error, setError] = useState('');

  const loadUsers = () => {
    if (!token) return;
    authFetchJson<User[]>('/users', token).then(setUsers).catch(() => {});
  };

  useEffect(loadUsers, [token]);

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return <p className="text-white/40">Недостаточно прав для просмотра этой страницы.</p>;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError('');

    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Ошибка');
      return;
    }

    setUsername('');
    setPassword('');
    setShowForm(false);
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Удалить пользователя?')) return;
    await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">Пользователи</h1>
          <p className="text-white/40 mt-1">Управление администраторами</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark text-sm font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-dark-card border border-dark-border p-6 mb-6 space-y-4 w-full max-w-xl">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Логин" required className={inputClass} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Пароль (мин. 6 символов)" required className={inputClass} />
          <select value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')} className={inputClass}>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="px-5 py-2 bg-gold text-dark text-sm font-semibold">Создать</button>
        </form>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between bg-dark-card border border-dark-border p-4">
            <div>
              <p className="text-white">{u.username}</p>
              <p className="text-white/40 text-xs">{u.role} · {new Date(u.createdAt).toLocaleDateString('ru-RU')}</p>
            </div>
            {u.id !== currentUser?.id && (
              <button onClick={() => handleDelete(u.id)} className="p-2 text-white/30 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
