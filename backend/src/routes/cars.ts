import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { slugify, parseIntSafe, asStringArray } from '../utils/helpers';
import { CarStatus } from '@prisma/client';

const CURRENCY_CODES = ['USD', 'EUR', 'UZS', 'TJS', 'AED', 'RUB', 'KZT', 'TRY', 'CNY'] as const;

const carSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  title: z.string().min(1),
  price: z.number().int().positive(),
  currency: z.enum(CURRENCY_CODES).optional(),
  year: z.number().int().min(1990).max(2030),
  mileage: z.number().int().min(0),
  color: z.string().min(1),
  engine: z.string().min(1),
  transmission: z.string().min(1),
  fuelType: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['AVAILABLE', 'SOLD']).optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

const router = Router();

function buildCarFilter(query: Request['query']) {
  const where: Record<string, unknown> = {};

  if (query.brand) where.brand = { contains: String(query.brand) };
  if (query.model) where.model = { contains: String(query.model) };
  if (query.color) where.color = { contains: String(query.color) };
  if (query.transmission) where.transmission = { contains: String(query.transmission) };
  if (query.fuelType) where.fuelType = { contains: String(query.fuelType) };
  if (query.status) where.status = String(query.status) as CarStatus;

  const priceMin = parseIntSafe(query.priceMin);
  const priceMax = parseIntSafe(query.priceMax);
  const yearMin = parseIntSafe(query.yearMin);
  const yearMax = parseIntSafe(query.yearMax);
  const mileageMax = parseIntSafe(query.mileageMax);

  if (priceMin !== undefined || priceMax !== undefined) {
    where.price = {};
    if (priceMin !== undefined) (where.price as Record<string, number>).gte = priceMin;
    if (priceMax !== undefined) (where.price as Record<string, number>).lte = priceMax;
  }

  if (yearMin !== undefined || yearMax !== undefined) {
    where.year = {};
    if (yearMin !== undefined) (where.year as Record<string, number>).gte = yearMin;
    if (yearMax !== undefined) (where.year as Record<string, number>).lte = yearMax;
  }

  if (mileageMax !== undefined) {
    where.mileage = { lte: mileageMax };
  }

  if (query.search) {
    const s = String(query.search);
    where.OR = [
      { title: { contains: s } },
      { brand: { contains: s } },
      { model: { contains: s } },
    ];
  }

  return where;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const where = buildCarFilter(req.query);
    const page = parseIntSafe(req.query.page, 1)!;
    const limit = Math.min(parseIntSafe(req.query.limit, 12)!, 50);
    const skip = (page - 1) * limit;

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.car.count({ where }),
    ]);

    res.json({ cars, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Ошибка загрузки автомобилей' });
  }
});

router.get('/filters', async (_req, res) => {
  try {
    const cars = await prisma.car.findMany({
      select: { brand: true, model: true, color: true, transmission: true, fuelType: true },
    });

    const brands = [...new Set(cars.map((c) => c.brand))].sort();
    const models = [...new Set(cars.map((c) => c.model))].sort();
    const colors = [...new Set(cars.map((c) => c.color))].sort();
    const transmissions = [...new Set(cars.map((c) => c.transmission))].sort();
    const fuelTypes = [...new Set(cars.map((c) => c.fuelType))].sort();

    res.json({ brands, models, colors, transmissions, fuelTypes });
  } catch {
    res.status(500).json({ error: 'Ошибка загрузки фильтров' });
  }
});

router.get('/featured', async (_req, res) => {
  const cars = await prisma.car.findMany({
    where: { featured: true, status: 'AVAILABLE' },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });
  res.json(cars);
});

router.get('/:slug', async (req, res) => {
  const car = await prisma.car.findUnique({ where: { slug: req.params.slug } });
  if (!car) return res.status(404).json({ error: 'Автомобиль не найден' });
  res.json(car);
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const data = carSchema.parse(req.body);
    const baseSlug = slugify(`${data.brand}-${data.model}-${data.year}`);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.car.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const car = await prisma.car.create({
      data: {
        ...data,
        slug,
        status: data.status || 'AVAILABLE',
        currency: data.currency || 'USD',
        images: data.images || [],
      },
    });

    res.status(201).json(car);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Ошибка создания автомобиля' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const data = carSchema.partial().parse(req.body);
    const car = await prisma.car.update({ where: { id: req.params.id }, data });
    res.json(car);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(404).json({ error: 'Автомобиль не найден' });
  }
});

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = z.object({ status: z.enum(['AVAILABLE', 'SOLD']) }).parse(req.body);
    const car = await prisma.car.update({ where: { id: req.params.id }, data: { status } });
    res.json(car);
  } catch {
    res.status(400).json({ error: 'Неверный статус' });
  }
});

router.patch('/:id/price', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { price } = z.object({ price: z.number().int().positive() }).parse(req.body);
    const car = await prisma.car.update({ where: { id: req.params.id }, data: { price } });
    res.json(car);
  } catch {
    res.status(400).json({ error: 'Неверная цена' });
  }
});

router.post('/:id/images', authMiddleware, upload.array('images', 30), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const newImages = files.map((f) => `/uploads/${f.filename}`);

    const car = await prisma.car.findUnique({ where: { id: req.params.id } });
    if (!car) return res.status(404).json({ error: 'Автомобиль не найден' });

    const updated = await prisma.car.update({
      where: { id: req.params.id },
      data: { images: [...asStringArray(car.images), ...newImages] },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Ошибка загрузки изображений' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.car.delete({ where: { id: req.params.id } });
    res.json({ message: 'Автомобиль удалён' });
  } catch {
    res.status(404).json({ error: 'Автомобиль не найден' });
  }
});

export default router;
