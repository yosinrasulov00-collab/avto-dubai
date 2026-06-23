const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return url;
  const base = API_URL.replace(/\/api$/, '');
  return `${base}${url}`;
}

export { getImageUrl };

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(error.error || 'Ошибка запроса');
  }

  return res.json();
}

export async function getCars(filters: Record<string, string> = {}): Promise<import('@/types').CarsResponse> {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
  );
  return fetchApi(`/cars?${params}`);
}

export async function getCar(slug: string): Promise<import('@/types').Car> {
  return fetchApi(`/cars/${slug}`);
}

export async function getFeaturedCars(): Promise<import('@/types').Car[]> {
  return fetchApi('/cars/featured');
}

export async function getFilterOptions(): Promise<import('@/types').FilterOptions> {
  return fetchApi('/cars/filters');
}

export async function getSettings(): Promise<import('@/types').Settings> {
  return fetchApi('/settings');
}

export async function getBanner(): Promise<import('@/types').Banner | null> {
  return fetchApi('/banners');
}

export async function submitOrder(data: {
  carId?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  honeypot?: string;
}): Promise<{ message: string }> {
  return fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export async function login(username: string, password: string) {
  return fetchApi<{ token: string; user: import('@/types').User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function authFetch(endpoint: string, token: string, options?: RequestInit) {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

export async function authFetchJson<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  const res = await authFetch(endpoint, token, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Ошибка' }));
    throw new Error(error.error || 'Ошибка запроса');
  }
  return res.json();
}

export async function uploadFile(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/settings/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Ошибка загрузки');
  const data = await res.json();
  return data.url;
}

export async function uploadCarImages(
  token: string,
  carId: string,
  files: File[]
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const res = await fetch(`${API_URL}/cars/${carId}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Ошибка загрузки');
  const car = await res.json();
  return Array.isArray(car.images) ? car.images : [];
}

const UPLOAD_BATCH_SIZE = 20;

export async function uploadCarImagesBatched(
  token: string,
  carId: string,
  files: File[]
): Promise<string[]> {
  if (!files.length) return [];
  let result: string[] = [];
  for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
    const chunk = files.slice(i, i + UPLOAD_BATCH_SIZE);
    result = await uploadCarImages(token, carId, chunk);
  }
  return result;
}

export async function uploadFilesBatched(token: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
    const chunk = files.slice(i, i + UPLOAD_BATCH_SIZE);
    const uploaded = await Promise.all(chunk.map((file) => uploadFile(token, file)));
    urls.push(...uploaded);
  }
  return urls;
}

export { formatPrice, CURRENCIES, getCurrencyLabel } from './currency';
export type { CurrencyCode } from './currency';

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('ru-RU').format(mileage) + ' км';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: 'В наличии',
    SOLD: 'Продано',
    NEW: 'Новая',
    IN_PROGRESS: 'В работе',
    COMPLETED: 'Завершена',
    CANCELLED: 'Отменена',
  };
  return labels[status] || status;
}
