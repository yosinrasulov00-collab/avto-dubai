'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { submitOrder } from '@/lib/api';

interface OrderFormProps {
  carId?: string;
  carTitle?: string;
}

export default function OrderForm({ carId, carTitle }: OrderFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitOrder({ carId, name, phone, email, message, honeypot });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass p-8 text-center gold-glow">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-display)] text-xl text-white mb-2">Заявка отправлена!</h3>
        <p className="text-white/50 text-sm">Мы свяжемся с вами в ближайшее время.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-gold text-sm hover:underline">
          Отправить ещё
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="glass p-6 lg:p-8 space-y-4 gold-glow">
      <h3 className="font-[family-name:var(--font-display)] text-xl text-white mb-2">
        Оставить заявку
      </h3>
      {carTitle && (
        <p className="text-white/50 text-sm mb-4">Автомобиль: {carTitle}</p>
      )}

      <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя *" required className={inputClass} />
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон *" required className={inputClass} />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Сообщение" rows={3} className={`${inputClass} resize-none`} />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-dark font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}
