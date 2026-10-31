import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PHONE_PATTERN } from '../../core/format';
import { CatalogItem } from '../../core/models';
import { OrderService, RecipeService } from '../../core/services/api.services';
import { PHOTOS } from '../../core/site';
import { Icon } from '../../shared/icon';
import { Modal } from '../../shared/modal';
import { RecipePhoto } from '../../shared/recipe-photo';

interface CartLine {
  item: CatalogItem;
  qty: number;
}

const MAX_QTY = 20;
const CART_KEY = 'dolce.cart';

@Component({
  selector: 'app-menu',
  imports: [ReactiveFormsModule, CurrencyPipe, Icon, Modal, RecipePhoto],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPage {
  private readonly recipes = inject(RecipeService);
  private readonly orders = inject(OrderService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly currency = new CurrencyPipe('he');

  protected readonly photos = PHOTOS;
  protected readonly minDate = toDateInput(new Date(Date.now() + 86_400_000));

  protected readonly catalog = signal<CatalogItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.catalog().filter((r) => !q || r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
  });

  /** recipe id -> quantity; kept in localStorage so a refresh doesn't empty the cart. */
  private readonly quantities = signal<Record<number, number>>(readCart());

  /** Item opened in the details window. */
  protected readonly details = signal<CatalogItem | null>(null);

  protected readonly cart = computed<CartLine[]>(() => {
    const q = this.quantities();
    return this.catalog()
      .filter((item) => q[item.id] > 0)
      .map((item) => ({ item, qty: q[item.id] }));
  });

  protected readonly itemCount = computed(() => this.cart().reduce((sum, l) => sum + l.qty, 0));
  protected readonly total = computed(() => this.cart().reduce((sum, l) => sum + (l.item.price ?? 0) * l.qty, 0));

  protected readonly checkoutOpen = signal(false);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    deliveryDate: ['', Validators.required],
    remarks: ['', Validators.maxLength(500)],
  });

  constructor() {
    this.load();
    effect(() => {
      const q = this.quantities();
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(q));
      } catch {}
    });
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.recipes
      .getCatalog()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.catalog.set([...(list ?? [])].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'he'))),
        error: () => this.loadFailed.set(true),
      });
  }

  protected qty(id: number): number {
    return this.quantities()[id] ?? 0;
  }

  protected change(id: number, delta: number): void {
    this.quantities.update((q) => {
      const next = Math.min(MAX_QTY, Math.max(0, (q[id] ?? 0) + delta));
      return { ...q, [id]: next };
    });
  }

  protected openCheckout(): void {
    this.details.set(null);
    this.sent.set(false);
    this.checkoutOpen.set(true);
  }

  protected closeCheckout(): void {
    this.checkoutOpen.set(false);
    if (this.sent()) {
      this.sent.set(false);
      this.form.reset();
    }
  }

  protected submit(): void {
    if (this.form.invalid || !this.cart().length) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.sending.set(true);
    this.orders
      .createPublic({
        client: { name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim() },
        deliveryDate: v.deliveryDate,
        notes: this.composeNotes(v.remarks.trim()),
      })
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe(() => {
        this.sent.set(true);
        this.quantities.set({});
      });
  }

  protected hasError(control: 'name' | 'email' | 'phone' | 'deliveryDate', error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }

  /** The order contents are stored as readable text in Order.notes for the staff. */
  private composeNotes(remarks: string): string {
    const lines = this.cart().map(
      (l) => `${l.qty} × ${l.item.name}` + (l.item.price != null ? ` (${this.money(l.item.price * l.qty)})` : ''),
    );
    if (this.total() > 0) lines.push(`סה״כ משוער: ${this.money(this.total())}`);
    if (remarks) lines.push(`הערות: ${remarks}`);
    return lines.join('\n');
  }

  private money(value: number): string {
    return this.currency.transform(value, 'ILS', 'symbol-narrow', '1.0-0') ?? String(value);
  }
}

function readCart(): Record<number, number> {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

function toDateInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
