import type { Metadata } from 'next';
import CatalogPage from '@/components/pages/CatalogPage';

export const metadata: Metadata = {
  title: 'Каталог — Авто Дубай Кхори',
  description:
    'Каталог Авто Дубай Кхори — премиальные автомобили из Дубая и ОАЭ. Фильтр по марке, цене, году. Lamborghini, Ferrari, Mercedes.',
  keywords: ['авто дубай кхори', 'каталог авто дубай', 'автомобили оаэ'],
};

export default function Catalog() {
  return <CatalogPage />;
}
