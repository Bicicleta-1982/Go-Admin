export function normalizeRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body}-${dv}`;
}

export function isValidRut(rut: string): boolean {
  const normalized = normalizeRut(rut);
  if (!/^\d{1,8}-[0-9K]$/.test(normalized)) {
    return false;
  }

  const [body, dv] = normalized.split('-');
  if (!body || !dv) return false;

  const reversed = body.split('').reverse();
  let sum = 0;
  let multiplier = 2;

  for (const digit of reversed) {
    sum += Number(digit) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expected = (() => {
    const mod = 11 - (sum % 11);
    if (mod === 11) return '0';
    if (mod === 10) return 'K';
    return String(mod);
  })();

  return expected === dv;
}

export function formatRut(rut: string): string {
  const normalized = normalizeRut(rut);
  if (!normalized.includes('-')) return normalized;

  const [body, dv] = normalized.split('-');
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

export function formatCurrencyCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateVatFromNet(net: number, rate: number): number {
  return Math.round(net * (rate / 100));
}

export function calculateTotalFromNet(net: number, rate: number): number {
  return net + calculateVatFromNet(net, rate);
}

export function formatDateSantiago(isoDate: string | Date): string {
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;

  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
