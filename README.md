# Dubai Auto Market

Современный сайт для продажи автомобилей из Дубая с премиальным дизайном и полной админ-панелью.

## Стек технологий

| Слой | Технологии |
|------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, Prisma ORM |
| База данных | PostgreSQL |
| Авторизация | JWT + bcrypt |

## Быстрый старт

### 1. Требования

- Node.js 18+
- PostgreSQL 14+

### 2. Установка

```bash
# Установить зависимости
npm run install:all

# Настроить backend (.env)
cp backend/.env.example backend/.env
# Отредактируйте DATABASE_URL в backend/.env

# Настроить frontend (.env)
cp frontend/.env.example frontend/.env.local

# Создать таблицы и заполнить данными
npm run db:setup
```

### 3. Запуск

```bash
npm run dev
```

- **Сайт:** http://localhost:3000
- **API:** http://localhost:4000
- **Админка:** http://localhost:3000/admin

### 4. Вход в админку

| Поле | Значение |
|------|----------|
| Логин | `admin` |
| Пароль | `yosin` |

> **Важно:** смените пароль после первого входа в разделе «Профиль».

## Структура проекта

```
├── backend/          # Express API
│   ├── prisma/       # Схема БД и seed
│   └── src/          # Роуты, middleware
├── frontend/         # Next.js приложение
│   └── src/
│       ├── app/      # Страницы (public + admin)
│       ├── components/
│       └── lib/      # API клиент
└── package.json      # Скрипты запуска
```

## Функционал

### Публичная часть
- Главная с hero-баннером и поиском
- Каталог с фильтрацией (марка, модель, цена, год, топливо, КПП, цвет)
- Страница автомобиля с галереей, WhatsApp/Telegram
- Форма заявки с защитой от спама (rate limit + honeypot)
- Google Maps, SEO, ЧПУ-ссылки

### Админ-панель (`/admin`)
- Управление автомобилями (CRUD, статус, цена, фото)
- Управление заявками
- Настройки сайта (тексты, контакты, фон, логотип)
- Управление пользователями (Super Admin)
- Смена пароля

## API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/cars` | Список авто с фильтрами |
| GET | `/api/cars/:slug` | Авто по slug |
| POST | `/api/orders` | Создать заявку |
| POST | `/api/auth/login` | Авторизация |
| PUT | `/api/settings` | Обновить настройки (auth) |

## База данных

Таблицы: `users`, `cars`, `orders`, `settings`, `banners`

## Дизайн

- Цвета: чёрный / золотой / белый
- Шрифты: Playfair Display + Inter
- Адаптивная вёрстка (мобильные + десктоп)
- Lazy loading изображений, анимации Framer Motion
