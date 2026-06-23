import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', async (_req, res) => {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => { map[s.key] = s.value; });
  res.json(map);
});

router.get('/:key', async (req, res) => {
  const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
  if (!setting) return res.status(404).json({ error: 'Настройка не найдена' });
  res.json(setting);
});

router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const data = z.record(z.string()).parse(req.body);

    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    if (data.hero_title || data.hero_subtitle) {
      const banner = await prisma.banner.findFirst({ where: { active: true }, orderBy: { updatedAt: 'desc' } });
      if (banner) {
        await prisma.banner.update({
          where: { id: banner.id },
          data: {
            ...(data.hero_title && { title: data.hero_title }),
            ...(data.hero_subtitle && { subtitle: data.hero_subtitle }),
          },
        });
      }
    }

    res.json({ message: 'Настройки сохранены' });
  } catch {
    res.status(400).json({ error: 'Неверные данные' });
  }
});

router.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
