/**
 * Datas como strings ISO "AAAA-MM-DD" (sem hora), para evitar erros de conversão UTC.
 * "Hoje" é calculado no fuso de Campo Grande.
 */

export const CLINIC_TZ = 'America/Campo_Grande';

export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, '0');

export const toISO = (y: number, m: number, d: number): ISODate => `${y}-${pad(m)}-${pad(d)}`;

export const parseISO = (iso: ISODate) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

const utc = (iso: ISODate) => {
  const { y, m, d } = parseISO(iso);
  return new Date(Date.UTC(y, m - 1, d));
};

const fromUTC = (date: Date): ISODate =>
  toISO(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());

export function todayInClinic(now: Date = new Date()): ISODate {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: CLINIC_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    return toISO(get('year'), get('month'), get('day'));
  } catch {
    // Campo Grande está em UTC−4 (sem horário de verão desde 2019)
    return fromUTC(new Date(now.getTime() - 4 * 60 * 60 * 1000));
  }
}

export const addDays = (iso: ISODate, days: number): ISODate => {
  const date = utc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUTC(date);
};

export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** Soma meses mantendo o dia quando possível (31/jan + 1 → 28 ou 29/fev). */
export const addMonths = (iso: ISODate, months: number): ISODate => {
  const { y, m, d } = parseISO(iso);
  const index = y * 12 + (m - 1) + months;
  const ny = Math.floor(index / 12);
  const nm = (index % 12) + 1;
  return toISO(ny, nm, Math.min(d, daysInMonth(ny, nm)));
};

/** 0 = segunda … 6 = domingo */
export const weekdayMon = (iso: ISODate) => (utc(iso).getUTCDay() + 6) % 7;

export const monthStart = (iso: ISODate): ISODate => {
  const { y, m } = parseISO(iso);
  return toISO(y, m, 1);
};

export const sameMonth = (a: ISODate, b: ISODate) => a.slice(0, 7) === b.slice(0, 7);

/** Dias úteis a partir de hoje. Feriados não são inferidos. */
export const isSelectable = (iso: ISODate, today: ISODate) => iso >= today && weekdayMon(iso) < 5;

export const formatBR = (iso: ISODate) => {
  const { y, m, d } = parseISO(iso);
  return `${pad(d)}/${pad(m)}/${y}`;
};

const longFmt = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatLong = (iso: ISODate) => longFmt.format(utc(iso));

const monthFmt = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' });

/** "Novembro 2026": cabe em uma linha no celular. */
export const formatMonth = (iso: ISODate) => {
  const month = monthFmt.format(utc(monthStart(iso)));
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${parseISO(iso).y}`;
};

/** Semanas (segunda a domingo) que cobrem o mês; null fora do mês. */
export function monthGrid(iso: ISODate): (ISODate | null)[][] {
  const { y, m } = parseISO(iso);
  const first = toISO(y, m, 1);
  const total = daysInMonth(y, m);
  const lead = weekdayMon(first);
  const cells: (ISODate | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(toISO(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (ISODate | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const WEEKDAYS = [
  { short: 'Seg', long: 'segunda-feira' },
  { short: 'Ter', long: 'terça-feira' },
  { short: 'Qua', long: 'quarta-feira' },
  { short: 'Qui', long: 'quinta-feira' },
  { short: 'Sex', long: 'sexta-feira' },
  { short: 'Sáb', long: 'sábado' },
  { short: 'Dom', long: 'domingo' },
];
