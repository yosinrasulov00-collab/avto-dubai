'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import { getSettings } from '@/lib/api';
import type { Settings } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const settingFields = [
  { key: 'site_name', label: 'Название сайта' },
  { key: 'hero_title', label: 'Заголовок баннера' },
  { key: 'hero_subtitle', label: 'Подзаголовок баннера' },
  { key: 'hero_background', label: 'URL фона главной' },
  { key: 'logo_url', label: 'URL логотипа' },
  { key: 'phone', label: 'Телефон' },
  { key: 'email', label: 'Email' },
  { key: 'whatsapp', label: 'WhatsApp (номер без +)' },
  { key: 'telegram', label: 'Telegram (username)' },
  { key: 'address', label: 'Адрес' },
  { key: 'map_lat', label: 'Широта (Google Maps)' },
  { key: 'map_lng', label: 'Долгота (Google Maps)' },
  { key: 'about_text', label: 'Текст «О нас»', textarea: true },
  { key: 'footer_text', label: 'Текст футера', textarea: true },
];

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSettings().then(setSettings).finally(() => setLoading(false));
  }, []);

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage('');

    try {
      await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setMessage('Настройки сохранены! Обновите главную страницу (F5).');
    } catch {
      setMessage('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white/40">Загрузка...</p>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-white mb-8">Настройки сайта</h1>

      <form onSubmit={handleSave} className="w-full max-w-none space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4">
        {settingFields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5">
              {field.label}
            </label>
            {field.textarea ? (
              <textarea
                value={(settings as Record<string, string>)[field.key] || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <input
                value={(settings as Record<string, string>)[field.key] || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className={inputClass}
              />
            )}
          </div>
        ))}
        </div>

        {message && (
          <p className={message.includes('Ошибка') ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-sm uppercase tracking-wider disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
