'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Lock } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center mx-auto mb-4 gold-glow">
            <Car className="w-8 h-8 text-dark" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-gradient-gold">
            Admin Panel
          </h1>
          <p className="text-white/40 text-sm mt-2">Авто Дубай Кхори</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 space-y-4 gold-glow">
          <div className="flex items-center gap-2 text-gold mb-4">
            <Lock className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wider">Авторизация</span>
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Логин"
            required
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
            className={inputClass}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
