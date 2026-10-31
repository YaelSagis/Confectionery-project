import { Order, OrderStatus } from './models';

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: 'חדשה' },
  { value: 'inProgress', label: 'בטיפול' },
  { value: 'ready', label: 'מוכנה' },
  { value: 'delivered', label: 'נמסרה' },
];

export function statusLabel(status: OrderStatus): string {
  return ORDER_STATUSES.find((s) => s.value === status)!.label;
}

/** How close the delivery date is; only used to highlight the date. */
export type Urgency = 'past' | 'today' | 'soon' | 'planned' | 'none';

const DAY_MS = 86_400_000;

export interface OrderView extends Order {
  status: OrderStatus;
  urgency: Urgency;
  date: Date | null;
}

export function toOrderView(o: Order): OrderView {
  const date = o.deliveryDate ? new Date(o.deliveryDate) : null;
  const urgency = urgencyOf(date);
  // Orders created before the status column existed: assume past ones were delivered.
  const status = o.status ?? (urgency === 'past' ? 'delivered' : 'new');
  return { ...o, date, urgency, status };
}

/** Whole days from today to the date (0 = today, negative = past). */
export function daysFromToday(date: Date): number {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  return Math.round((new Date(date).setHours(0, 0, 0, 0) - startOfToday) / DAY_MS);
}

function urgencyOf(date: Date | null): Urgency {
  if (!date || isNaN(date.getTime())) return 'none';
  const days = daysFromToday(date);
  if (days < 0) return 'past';
  if (days === 0) return 'today';
  return days <= 3 ? 'soon' : 'planned';
}

export function toDateInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
