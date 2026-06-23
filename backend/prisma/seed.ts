import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultSettings = [
  { key: 'site_name', value: 'Авто Дубай Кхори' },
  { key: 'hero_title', value: 'Авто Дубай Кхори' },
  { key: 'hero_subtitle', value: 'Премиальные автомобили из ОАЭ — лучшие цены' },
  { key: 'hero_background', value: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80' },
  { key: 'logo_url', value: '' },
  { key: 'phone', value: '+971 50 123 4567' },
  { key: 'email', value: 'info@dubaiauto.ae' },
  { key: 'whatsapp', value: '971501234567' },
  { key: 'telegram', value: 'dubaiautomarket' },
  { key: 'address', value: 'Dubai, Sheikh Zayed Road, UAE' },
  { key: 'map_lat', value: '25.2048' },
  { key: 'map_lng', value: '55.2708' },
  { key: 'about_text', value: 'Авто Дубай Кхори — ваш надёжный партнёр в покупке премиальных автомобилей из ОАЭ. Мы предлагаем лучшие цены, полную прозрачность и профессиональное сопровождение сделки.' },
  { key: 'footer_text', value: '© 2026 Авто Дубай Кхори. Все права защищены.' },
];

const sampleCars = [
  {
    slug: 'mercedes-benz-s-class-2024',
    brand: 'Mercedes-Benz',
    model: 'S-Class',
    title: 'Mercedes-Benz S-Class 2024',
    price: 185000,
    year: 2024,
    mileage: 5000,
    color: 'Чёрный',
    engine: '3.0L V6 Turbo',
    transmission: 'Автомат',
    fuelType: 'Бензин',
    description: 'Роскошный седан Mercedes-Benz S-Class 2024 года в идеальном состоянии. Полная комплектация AMG Line, панорамная крыша, массажные сиденья, система MBUX с голосовым управлением. Автомобиль из официального дилера ОАЭ.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
    ],
  },
  {
    slug: 'bmw-x7-2023',
    brand: 'BMW',
    model: 'X7',
    title: 'BMW X7 xDrive40i 2023',
    price: 142000,
    year: 2023,
    mileage: 18000,
    color: 'Белый',
    engine: '3.0L I6 Turbo',
    transmission: 'Автомат',
    fuelType: 'Бензин',
    description: 'Просторный семиместный BMW X7 в белом перламутре. M Sport пакет, адаптивная подвеска, Harman Kardon, проекционный дисплей. Идеален для семьи и деловых поездок.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
    ],
  },
  {
    slug: 'range-rover-sport-2024',
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    title: 'Range Rover Sport HSE 2024',
    price: 168000,
    year: 2024,
    mileage: 8000,
    color: 'Серый',
    engine: '3.0L I6 MHEV',
    transmission: 'Автомат',
    fuelType: 'Гибрид',
    description: 'Новый Range Rover Sport HSE с гибридной силовой установкой. Terrain Response 2, Meridian Surround Sound, 22" колёса, кожаный салон Windsor. Прямая поставка из Дубая.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    ],
  },
  {
    slug: 'porsche-cayenne-2023',
    brand: 'Porsche',
    model: 'Cayenne',
    title: 'Porsche Cayenne S 2023',
    price: 155000,
    year: 2023,
    mileage: 12000,
    color: 'Чёрный',
    engine: '2.9L V6 Twin-Turbo',
    transmission: 'PDK',
    fuelType: 'Бензин',
    description: 'Porsche Cayenne S с мощным V6 двигателем. Sport Chrono Package, адаптивные PDCC, BOSE Surround Sound, 21" Turbo Design колёса. Спортивный характер и комфорт в одном.',
    status: 'AVAILABLE' as const,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    ],
  },
  {
    slug: 'lamborghini-urus-2022',
    brand: 'Lamborghini',
    model: 'Urus',
    title: 'Lamborghini Urus 2022',
    price: 285000,
    year: 2022,
    mileage: 15000,
    color: 'Жёлтый',
    engine: '4.0L V8 Twin-Turbo',
    transmission: 'Автомат',
    fuelType: 'Бензин',
    description: 'Эксклюзивный Lamborghini Urus в фирменном жёлтом цвете Giallo Auge. Полный carbon pack, Akrapovic выхлоп, 23" колёса. Самый быстрый SUV в мире.',
    status: 'SOLD' as const,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    ],
  },
  {
    slug: 'toyota-land-cruiser-2024',
    brand: 'Toyota',
    model: 'Land Cruiser',
    title: 'Toyota Land Cruiser 300 2024',
    price: 98000,
    year: 2024,
    mileage: 3000,
    color: 'Белый',
    engine: '3.5L V6 Twin-Turbo',
    transmission: 'Автомат',
    fuelType: 'Бензин',
    description: 'Легендарный Toyota Land Cruiser 300 в максимальной комплектации. JBL Premium Audio, Multi-Terrain Select, Crawl Control. Надёжность и комфорт для любых дорог.',
    status: 'AVAILABLE' as const,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1533473357861-0d2d3e2fe4a5?w=800&q=80',
    ],
  },
  {
    slug: 'lamborghini-aventador-roadster-purple-2021',
    brand: 'Lamborghini',
    model: 'Aventador',
    title: 'Lamborghini Aventador LP 700-4 Roadster',
    price: 485000,
    year: 2021,
    mileage: 4200,
    color: 'Матовый фиолетовый',
    engine: '6.5L V12',
    transmission: 'Автомат (ISR)',
    fuelType: 'Бензин',
    description: 'Эксклюзивный Lamborghini Aventador Roadster в редком матовом фиолетовом цвете. Шедевр итальянского инженерного искусства с атмосферным V12, съёмной жёсткой крышей и агрессивной аэродинамикой. Чёрные диски с жёлтыми карбон-керамическими суппортами, Y-образная оптика. Идеален для коллекционеров и ценителей суперкаров высшего класса.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/lamborghini-aventador-roadster-purple.png'],
  },
  {
    slug: 'ferrari-599-gtb-gold-2008',
    brand: 'Ferrari',
    model: '599 GTB Fiorano',
    title: 'Ferrari 599 GTB Fiorano Gold Edition',
    price: 425000,
    year: 2008,
    mileage: 18500,
    color: 'Золотой хром',
    engine: '6.0L V12',
    transmission: 'Автомат (F1)',
    fuelType: 'Бензин',
    description: 'Легендарный Ferrari 599 GTB Fiorano в уникальной золотой хромированной обёртке с матовой чёрной полосой на капоте. Кастомные чёрные диски с полированным ободом, атмосферный V12 мощностью 620 л.с. Редкий экземпляр для истинных ценителей итальянского автопрома и эксклюзивного стайлинга.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/ferrari-599-gtb-gold.png'],
  },
  {
    slug: 'lamborghini-aventador-gold-edition-2019',
    brand: 'Lamborghini',
    model: 'Aventador',
    title: 'Lamborghini Aventador Gold Edition by Maatouk',
    price: 1850000,
    year: 2019,
    mileage: 6800,
    color: 'Белый перламутр / золото',
    engine: '6.5L V12',
    transmission: 'Автомат (ISR)',
    fuelType: 'Бензин',
    description: 'Ультра-эксклюзивный Lamborghini Aventador в исполнении Maatouk Design — жемчужно-белый кузов с позолоченными акцентами: зеркала, ободки воздухозаборников, тонкие полосы по кузову и золотые 20-дюймовые диски. Чёрная крыша создаёт контрастный двухтоновый образ. Настоящий предмет коллекционирования для тех, кто ценит бескомпромиссную роскошь.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/lamborghini-aventador-gold-edition.png'],
  },
  {
    slug: 'lamborghini-huracan-orange-2022',
    brand: 'Lamborghini',
    model: 'Huracán',
    title: 'Lamborghini Huracán Arancio Borealis',
    price: 289000,
    year: 2022,
    mileage: 9200,
    color: 'Оранжевый',
    engine: '5.2L V10',
    transmission: 'Автомат (LDF)',
    fuelType: 'Бензин',
    description: 'Яркий Lamborghini Huracán в фирменном оранжевом цвете Arancio Borealis. Острые угловатые линии, атмосферный V10 на 640 л.с., полный привод и мгновенный разгон до 100 км/ч за 2.9 секунды. Чёрные диски, агрессивная аэродинамика — воплощение итальянской страсти к скорости.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/lamborghini-huracan-orange.png'],
  },
  {
    slug: 'lamborghini-huracan-yellow-dubai-2023',
    brand: 'Lamborghini',
    model: 'Huracán',
    title: 'Lamborghini Huracán Giallo Inti Dubai',
    price: 315000,
    year: 2023,
    mileage: 5100,
    color: 'Жёлтый',
    engine: '5.2L V10',
    transmission: 'Автомат (LDF)',
    fuelType: 'Бензин',
    description: 'Lamborghini Huracán в ослепительном жёлтом цвете Giallo Inti на фоне панорамы Дубая с видом на Burj Khalifa. Атмосферный V10, LED-оптика, чёрные акценты на зеркалах и воздухозаборниках. Символ премиального образа жизни ОАЭ — скорость, стиль и безупречный итальянский дизайн.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/lamborghini-huracan-yellow-dubai.png'],
  },
  {
    slug: 'rolls-royce-phantom-dubai-2022',
    brand: 'Rolls-Royce',
    model: 'Phantom',
    title: 'Rolls-Royce Phantom Extended Wheelbase',
    price: 595000,
    year: 2022,
    mileage: 7800,
    color: 'Белый',
    engine: '6.75L V12 Twin-Turbo',
    transmission: 'Автомат (ZF 8HP)',
    fuelType: 'Бензин',
    description: 'Rolls-Royce Phantom Extended Wheelbase — вершина автомобильной роскоши. Белоснежный кузов, хромированная решётка радиатора, статуэтка Spirit of Ecstasy. Роскошный салон с ручной отделкой, задние двери против хода, бесшумный V12. Дубайский номер D 77705. Для VIP-клиентов, ценящих абсолютный комфорт и престиж.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/rolls-royce-phantom-dubai.png'],
  },
  {
    slug: 'lamborghini-aventador-matte-black-2020',
    brand: 'Lamborghini',
    model: 'Aventador',
    title: 'Lamborghini Aventador Matte Black VIP',
    price: 528000,
    year: 2020,
    mileage: 11200,
    color: 'Матовый чёрный',
    engine: '6.5L V12',
    transmission: 'Автомат (ISR)',
    fuelType: 'Бензин',
    description: 'Lamborghini Aventador в стелс-матовом чёрном исполнении из VIP-шоурума. Y-образные LED-фары, массивные воздухозаборники, золотой герб Lamborghini на капоте. Атмосферный V12, полный привод, эксклюзивная аэродинамика. Один из самых желанных суперкаров для коллекции премиум-класса.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/lamborghini-aventador-matte-black.png'],
  },
  {
    slug: 'lamborghini-huracan-spyder-silver-2021',
    brand: 'Lamborghini',
    model: 'Huracán Spyder',
    title: 'Lamborghini Huracán Spyder Silver Edition',
    price: 342000,
    year: 2021,
    mileage: 7600,
    color: 'Серебристый / красный',
    engine: '5.2L V10',
    transmission: 'Автомат (LDF)',
    fuelType: 'Бензин',
    description: 'Lamborghini Huracán Spyder в серебристом металлике с красной гоночной полосой на капоте и тёмно-красным мягким верхом. Кастомные чёрные диски с пятилепестковым дизайном, открытый кузов для максимальных эмоций от вождения. V10, полный привод, идеален для прогулок по набережным Дубая.',
    status: 'AVAILABLE' as const,
    featured: true,
    images: ['/uploads/lamborghini-huracan-spyder-silver.png'],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('yosin', 12);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  const existingBanner = await prisma.banner.findFirst();
  if (!existingBanner) {
    await prisma.banner.create({
      data: {
        title: 'Авто Дубай Кхори',
        subtitle: 'Премиальные автомобили из ОАЭ — лучшие цены',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
        active: true,
      },
    });
  } else {
    await prisma.banner.update({
      where: { id: existingBanner.id },
      data: {
        title: 'Авто Дубай Кхори',
        subtitle: 'Премиальные автомобили из ОАЭ — лучшие цены',
      },
    });
  }

  for (const car of sampleCars) {
    await prisma.car.upsert({
      where: { slug: car.slug },
      update: {
        title: car.title,
        price: car.price,
        description: car.description,
        images: car.images,
        featured: car.featured,
        status: car.status,
      },
      create: car,
    });
  }

  console.log('✅ Seed completed!');
  console.log('   Admin login: admin / yosin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
