'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import { authFetchJson } from '@/lib/api';
import ImageUploader from '@/components/admin/ImageUploader';
import type { Car } from '@/types';
import { CURRENCIES } from '@/lib/currency';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none';
  const labelClass = 'block text-xs uppercase tracking-wider text-white/40 mb-1.5';

  useEffect(() => {
    if (!token) return;
    authFetchJson<{ cars: Car[] }>('/cars?limit=100', token).then((data) => {
      const car = data.cars.find((c) => c.id === id);
      if (car) {
        setForm({
          brand: car.brand, model: car.model, title: car.title,
          price: String(car.price), currency: car.currency || 'USD',
          year: String(car.year), mileage: String(car.mileage),
          color: car.color, engine: car.engine, transmission: car.transmission,
          fuelType: car.fuelType, description: car.description, status: car.status,
          featured: car.featured,
        });
        setImages(Array.isArray(car.images) ? car.images : []);
      }
      setLoading(false);
    });
  }, [token, id]);

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
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand, model: form.model, title: form.title,
          price: parseInt(form.price as string),
          currency: form.currency as string,
          year: parseInt(form.year as string),
          mileage: parseInt(form.mileage as string),
          color: form.color, engine: form.engine,
          transmission: form.transmission, fuelType: form.fuelType,
          description: form.description, status: form.status,
          featured: form.featured,
          images,
        }),
      });
      if (!res.ok) throw new Error('Ошибка сохранения');
      alert('Сохранено!');
    } catch {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !confirm('Удалить автомобиль?')) return;
    await fetch(`${API_URL}/cars/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push('/admin/cars');
  };

  if (loading) return <p className="text-white/40">Загрузка...</p>;

  return (
    <div>
      <Link href="/admin/cars" className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">Редактировать</h1>
        <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 text-red-400 border border-red-400/30 text-sm hover:bg-red-400/10">
          <Trash2 className="w-4 h-4" /> Удалить
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div><label className={labelClass}>Марка</label><input name="brand" value={form.brand as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Модель</label><input name="model" value={form.model as string} onChange={handleChange} className={inputClass} /></div>
          <div className="sm:col-span-2"><label className={labelClass}>Название</label><input name="title" value={form.title as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Цена</label><input name="price" type="number" value={form.price as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Валюта</label>
            <select name="currency" value={(form.currency as string) || 'USD'} onChange={handleChange} className={inputClass}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div><label className={labelClass}>Год</label><input name="year" type="number" value={form.year as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Пробег</label><input name="mileage" type="number" value={form.mileage as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Цвет</label><input name="color" value={form.color as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Двигатель</label><input name="engine" value={form.engine as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Коробка</label><input name="transmission" value={form.transmission as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Топливо</label><input name="fuelType" value={form.fuelType as string} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Статус</label>
            <select name="status" value={form.status as string} onChange={handleChange} className={inputClass}>
              <option value="AVAILABLE">В наличии</option>
              <option value="SOLD">Продано</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" name="featured" checked={form.featured as boolean} onChange={handleChange} id="featured-edit" />
            <label htmlFor="featured-edit" className="text-sm text-white/60">Показывать в «Популярные автомобили» на главной</label>
          </div>
        </div>
        <div><label className={labelClass}>Описание</label><textarea name="description" value={form.description as string} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} /></div>
        {token && (
          <ImageUploader
            images={images}
            onChange={setImages}
            token={token}
            carId={id}
          />
        )}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold text-sm uppercase tracking-wider disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
