import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest, authMiddleware, superAdminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, superAdminMiddleware, async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

router.post('/', authMiddleware, superAdminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, role } = z
      .object({
        username: z.string().min(3),
        password: z.string().min(6),
        role: z.enum(['ADMIN', 'SUPER_ADMIN']).optional(),
      })
      .parse(req.body);

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Пользователь уже существует' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, password: hashed, role: role || 'ADMIN' },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Неверные данные' });
    }
    res.status(500).json({ error: 'Ошибка создания пользователя' });
  }
});

router.delete('/:id', authMiddleware, superAdminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.id === req.user!.id) {
      return res.status(400).json({ error: 'Нельзя удалить себя' });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Пользователь удалён' });
  } catch {
    res.status(404).json({ error: 'Пользователь не найден' });
  }
});

export default router;
