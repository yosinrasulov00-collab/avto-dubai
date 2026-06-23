import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: { id: string; username: string; role: string };
}

export function generateToken(payload: { id: string; username: string; role: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      username: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

export function superAdminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Недостаточно прав' });
  }
  next();
}
