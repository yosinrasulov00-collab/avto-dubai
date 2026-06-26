import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-body' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Авто Дубай Кхори — Купить авто из Дубая | Официальный сайт',
    template: '%s | Авто Дубай Кхори',
  },
  description:
    'Авто Дубай Кхори (Авто Дубай Кори) — премиальные автомобили из Дубая и ОАЭ. Каталог авто, лучшие цены, доставка и полное сопровождение сделки.',
  keywords: [
    'авто дубай кхори',
    'авто дубай кори',
    'авто дубай кхори официальный сайт',
    'авто дубай',
    'авто из дубая',
    'купить авто из дубая',
    'автомобили ОАЭ',
    'авто дубай кхори каталог',
    'dubai auto khori',
  ],
  applicationName: 'Авто Дубай Кхори',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Авто Дубай Кхори — Премиальные автомобили из ОАЭ',
    description: 'Авто Дубай Кхори — официальный каталог автомобилей из Дубая',
    type: 'website',
    siteName: 'Авто Дубай Кхори',
    locale: 'ru_RU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Авто Дубай Кхори',
    alternateName: ['Авто Дубай Кори', 'Avto Dubai Khori'],
    url: siteUrl,
    description: 'Премиальные автомобили из Дубая и ОАЭ',
    areaServed: ['RU', 'AE', 'TJ', 'UZ', 'KZ'],
    inLanguage: 'ru',
  };

  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
