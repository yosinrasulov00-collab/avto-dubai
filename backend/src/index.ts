import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import carsRoutes from './routes/cars';
import ordersRoutes from './routes/orders';
import settingsRoutes from './routes/settings';
import bannersRoutes from './routes/banners';
import usersRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = process.env.FRONTEND_URL;
    if (
      !allowed ||
      origin === allowed ||
      origin.startsWith('http://localhost:') ||
      origin.endsWith('.trycloudflare.com') ||
      origin.endsWith('.loca.lt') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com')
    ) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Dubai Auto Market API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/users', usersRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`🚗 Dubai Auto Market API running on http://localhost:${PORT}`);
});
