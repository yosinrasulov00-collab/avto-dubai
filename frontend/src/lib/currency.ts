export const CURRENCIES = [
  { code: 'USD', label: 'Доллар США ($)' },
  { code: 'EUR', label: 'Евро (€)' },
  { code: 'UZS', label: 'Узбекский сом (сум)' },
  { code: 'TJS', label: 'Таджикский сомони (смн)' },
  { code: 'AED', label: 'Дирхам ОАЭ (AED)' },
  { code: 'RUB', label: 'Российский рубль (₽)' },
  { code: 'KZT', label: 'Казахстанский тенге (₸)' },
  { code: 'TRY', label: 'Турецкая лира (₺)' },
  { code: 'CNY', label: 'Китайский юань (¥)' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

const CURRENCY_CODES = new Set<string>(CURRENCIES.map((c) => c.code));

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODES.has(value);
}

export function getCurrencyLabel(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.label ?? code;
}

export function formatPrice(price: number, currency = 'USD'): string {
  const code = isCurrencyCode(currency) ? currency : 'USD';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
  }).format(price);
}
