import type { Metadata } from 'next';
import { getCar } from '@/lib/api';
import CarDetailPage from '@/components/pages/CarDetailPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const car = await getCar(slug);
    return {
      title: car.title,
      description: car.description.slice(0, 160),
      openGraph: {
        title: car.title,
        description: car.description.slice(0, 160),
        images: car.images[0] ? [car.images[0]] : [],
      },
    };
  } catch {
    return { title: 'Автомобиль не найден' };
  }
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params;
  return <CarDetailPage slug={slug} />;
}
