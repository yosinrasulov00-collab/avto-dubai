import { Router, Response } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Слишком много заявок. Попробуйте позже.' },
});

const orderSchema = z.object({
  carId: z.string().optional(),
  name: z.string().min(2).max(100),
  phone: z.string().min(5).max(20),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
  honeypot: z.string().optional(),
});

router.post('/', orderLimiter, async (req, res) => {
  try {
    const data = orderSchema.parse(req.body);

    if (data.honeypot) {
      return res.json({ message: 'Заявка отправлена' });
    }

    const order = await prisma.order.create({
      data: {
        carId: data.carId || null,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
      },
    });

    res.status(201).json({ message: 'Заявка успешно отправлена', id: order.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Проверьте правильность данных' });
    }
    res.status(500).json({ error: 'Ошибка отправки заявки' });
  }
});

router.get('/', authMiddleware, async (_req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { car: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = z
      .object({ status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']) })
      .parse(req.body);

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(order);
  } catch {
    res.status(400).json({ error: 'Неверный статус' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.order.delete({ where: { id: req.params.id } });
    res.json({ message: 'Заявка удалена' });
  } catch {
    res.status(404).json({ error: 'Заявка не найдена' });
  }
});

export default router;
