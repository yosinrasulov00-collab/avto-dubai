import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', async (_req, res) => {
  const banner = await prisma.banner.findFirst({ where: { active: true }, orderBy: { updatedAt: 'desc' } });
  res.json(banner);
});

router.get('/all', authMiddleware, async (_req: AuthRequest, res: Response) => {
  const banners = await prisma.banner.findMany({ orderBy: { updatedAt: 'desc' } });
  res.json(banners);
});

router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const data = z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      active: z.boolean().optional(),
    }).parse(req.body);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.imageUrl || '';

    if (data.active) {
      await prisma.banner.updateMany({ data: { active: false } });
    }

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl,
        videoUrl: data.videoUrl || null,
        active: data.active ?? true,
      },
    });

    res.status(201).json(banner);
  } catch {
    res.status(400).json({ error: 'Неверные данные баннера' });
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const data = z.object({
      title: z.string().min(1).optional(),
      subtitle: z.string().min(1).optional(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      active: z.boolean().optional(),
    }).parse(req.body);

    if (data.active) {
      await prisma.banner.updateMany({ data: { active: false } });
    }

    const updateData: Record<string, unknown> = { ...data };
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const banner = await prisma.banner.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(banner);
  } catch {
    res.status(404).json({ error: 'Баннер не найден' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.banner.delete({ where: { id: req.params.id } });
    res.json({ message: 'Баннер удалён' });
  } catch {
    res.status(404).json({ error: 'Баннер не найден' });
  }
});

export default router;
