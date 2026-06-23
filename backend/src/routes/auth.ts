import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest, authMiddleware, generateToken } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Неверные данные' });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, username: true, role: true, createdAt: true },
  });
  res.json(user);
});

router.post('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ error: 'Неверный текущий пароль' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
