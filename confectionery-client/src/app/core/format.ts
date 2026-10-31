import { Difficulty } from './models';

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'קל' },
  { value: 'middle', label: 'בינוני' },
  { value: 'hard', label: 'מאתגר' },
];

/** Seed data uses "easy"/"middle"; accept common variants too. */
export function normalizeDifficulty(value: string | null | undefined): Difficulty | null {
  const v = value?.trim().toLowerCase();
  if (!v) return null;
  if (v === 'easy' || v === 'קל') return 'easy';
  if (v === 'middle' || v === 'medium' || v === 'בינוני') return 'middle';
  if (v === 'hard' || v === 'difficult' || v === 'קשה' || v === 'מאתגר') return 'hard';
  return null;
}

export function difficultyLabel(value: string | null | undefined): string | null {
  const d = normalizeDifficulty(value);
  return d ? DIFFICULTIES.find((x) => x.value === d)!.label : (value ?? null);
}

export function initials(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?';
}

export function monogram(name: string | null | undefined): string {
  return (name ?? '').trim().charAt(0).toUpperCase() || '·';
}

/** Splits a multi-line text field into items, dropping blanks and leading bullets / numbering. */
export function lines(text: string | null | undefined): string[] {
  return (text ?? '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

/** Loose phone check: digits with optional +, spaces and dashes (050-1234567, +972 50 123 4567). */
export const PHONE_PATTERN = /^\+?[\d\s-]{9,16}$/;
