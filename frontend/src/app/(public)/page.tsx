import type { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'Авто Дубай Кхори — Купить авто из Дубая',
  description:
    'Авто Дубай Кхори — официальный каталог премиальных автомобилей из ОАЭ. Lamborghini, Ferrari, Rolls-Royce. Лучшие цены, доставка, полное сопровождение.',
  keywords: [
    'авто дубай кхори',
    'авто дубай',
    'купить авто из дубая',
    'автомобили из оаэ',
    'премиальные авто дубай',
  ],
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <HomePage />;
}
