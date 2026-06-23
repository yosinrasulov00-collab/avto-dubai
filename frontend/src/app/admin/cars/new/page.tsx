'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import ImageUploader from '@/components/admin/ImageUploader';
import { uploadCarImagesBatched } from '@/lib/api';
import { CURRENCIES } from '@/lib/currency';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const emptyForm = {
  brand: '', model: '', title: '', price: '', currency: 'USD', year: '', mileage: '',
  color: '', engine: '', transmission: '', fuelType: '', description: '',
  status: 'AVAILABLE', featured: false,
};

export default function NewCarPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none';
  const labelClass = 'block text-xs uppercase tracking-wider text-white/40 mb-1.5';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand,
          model: form.model,
          title: form.title,
          price: parseInt(form.price),
          currency: form.currency,
          year: parseInt(form.year),
          mileage: parseInt(form.mileage),
          color: form.color,
          engine: form.engine,
          transmission: form.transmission,
          fuelType: form.fuelType,
          description: form.description,
          status: form.status,
          featured: form.featured,
          images,
        }),
      });

      if (!res.ok) throw new Error('Ошибка создания');
      const car = await res.json();

      if (pendingFiles.length > 0) {
        setError('');
        await uploadCarImagesBatched(token, car.id, pendingFiles);
      }

      router.push(`/admin/cars/${car.id}`);
    } catch {
      setError('Ошибка создания автомобиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link href="/admin/cars" className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Link>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-white mb-8">Добавить автомобиль</h1>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div><label className={labelClass}>Марка *</label><input name="brand" value={form.brand} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Модель *</label><input name="model" value={form.model} onChange={handleChange} required className={inputClass} /></div>
          <div className="sm:col-span-2"><label className={labelClass}>Название *</label><input name="title" value={form.title} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Цена *</label><input name="price" type="number" value={form.price} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Валюта *</label>
            <select name="currency" value={form.currency} onChange={handleChange} required className={inputClass}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div><label className={labelClass}>Год *</label><input name="year" type="number" value={form.year} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Пробег (км) *</label><input name="mileage" type="number" value={form.mileage} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Цвет *</label><input name="color" value={form.color} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Двигатель *</label><input name="engine" value={form.engine} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Коробка *</label><input name="transmission" value={form.transmission} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Топливо *</label><input name="fuelType" value={form.fuelType} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Статус</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="AVAILABLE">В наличии</option>
              <option value="SOLD">Продано</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featured" />
            <label htmlFor="featured" className="text-sm text-white/60">Показывать в «Популярные автомобили» на главной</label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Описание *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} />
        </div>

        {token && (
          <ImageUploader
            images={images}
            onChange={setImages}
            token={token}
            pendingFiles={pendingFiles}
            onPendingFilesChange={setPendingFiles}
          />
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-sm uppercase tracking-wider disabled:opacity-50">
          <Save className="w-4 h-4" /> {loading ? (pendingFiles.length ? 'Сохранение и загрузка фото...' : 'Сохранение...') : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
