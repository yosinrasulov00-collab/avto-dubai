import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-body' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Авто Дубай Кхори — Премиальные автомобили из ОАЭ',
    template: '%s | Авто Дубай Кхори',
  },
  description: 'Авто Дубай Кхори — премиальные автомобили из Дубая и ОАЭ. Лучшие цены, полное сопровождение сделки.',
  keywords: ['авто дубай кхори', 'авто дубай', 'авто из дубая', 'автомобили ОАЭ', 'luxury cars dubai'],
  openGraph: {
    title: 'Авто Дубай Кхори — Премиальные автомобили из ОАЭ',
    description: 'Премиальные автомобили из Дубая с доставкой',
    type: 'website',
    siteName: 'Авто Дубай Кхори',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
