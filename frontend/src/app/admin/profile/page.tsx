'use client';

import { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminProfilePage() {
  const { token, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Новый пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Пароль успешно изменён!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-white mb-2">Профиль</h1>
      <p className="text-white/40 mb-8">Пользователь: {user?.username} ({user?.role})</p>

      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 text-gold mb-6">
          <KeyRound className="w-5 h-5" />
          <h2 className="text-lg">Смена пароля</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5">Текущий пароль</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5">Новый пароль</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5">Подтвердите пароль</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
          </div>

          {message && (
            <p className={message.includes('успешно') ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-sm uppercase tracking-wider disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Сохранение...' : 'Изменить пароль'}
          </button>
        </form>

        <div className="mt-8 p-4 border border-gold/20 bg-gold/5">
          <p className="text-gold/80 text-sm">
            ⚠ Рекомендуем сменить пароль по умолчанию (admin / yosin) сразу после первого входа.
          </p>
        </div>
      </div>
    </div>
  );
}
