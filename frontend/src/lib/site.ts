const DEFAULT_SITE_NAME = 'Авто Дубай Кхори';

export function getSiteName(siteName?: string): string {
  return siteName?.trim() || DEFAULT_SITE_NAME;
}

export function splitSiteName(siteName?: string): { primary: string; secondary: string } {
  const name = getSiteName(siteName);
  const parts = name.split(/\s+/);
  if (parts.length <= 1) return { primary: name, secondary: '' };
  return {
    primary: parts.slice(0, -1).join(' '),
    secondary: parts[parts.length - 1],
  };
}
