export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  title: string;
  price: number;
  currency: string;
  year: number;
  mileage: number;
  color: string;
  engine: string;
  transmission: string;
  fuelType: string;
  description: string;
  status: 'AVAILABLE' | 'SOLD';
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  priceMin?: string;
  priceMax?: string;
  yearMin?: string;
  yearMax?: string;
  mileageMax?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  status?: string;
  search?: string;
  page?: string;
}

export interface FilterOptions {
  brands: string[];
  models: string[];
  colors: string[];
  transmissions: string[];
  fuelTypes: string[];
}

export interface Order {
  id: string;
  carId: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  car?: { id: string; title: string; slug: string };
}

export interface Settings {
  site_name?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_background?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  telegram?: string;
  address?: string;
  map_lat?: string;
  map_lng?: string;
  about_text?: string;
  footer_text?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl: string | null;
  active: boolean;
}

export interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
}

export interface CarsResponse {
  cars: Car[];
  total: number;
  page: number;
  totalPages: number;
}
