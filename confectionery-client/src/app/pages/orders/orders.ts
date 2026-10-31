import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PHONE_PATTERN, initials } from '../../core/format';
import { Client, ClientInput, Order, OrderStatus } from '../../core/models';
import { ORDER_STATUSES, OrderView, statusLabel, toDateInput, toOrderView } from '../../core/orders';
import { ClientService, OrderService } from '../../core/services/api.services';
import { ConfirmService, ToastService } from '../../core/services/ui.services';
import { Icon } from '../../shared/icon';
import { Modal } from '../../shared/modal';

type OrderFilter = 'all' | OrderStatus;
type ClientMode = 'existing' | 'new';

@Component({
  selector: 'app-orders',
  imports: [ReactiveFormsModule, DatePipe, Icon, Modal],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage implements OnInit {
  private readonly api = inject(OrderService);
  private readonly clientsApi = inject(ClientService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly fb = inject(NonNullableFormBuilder);

  /** ?status=new from the dashboard links pre-selects a filter. */
  readonly status = input<string>();

  protected readonly statuses = ORDER_STATUSES;
  protected readonly initials = initials;
  protected readonly today = toDateInput(new Date());

  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly query = signal('');
  protected readonly filter = signal<OrderFilter>('all');

  private readonly views = computed<OrderView[]>(() => this.orders().map(toOrderView));

  protected readonly counts = computed(() => {
    const counts: Record<OrderFilter, number> = { all: 0, new: 0, inProgress: 0, ready: 0, delivered: 0 };
    for (const o of this.views()) {
      counts.all++;
      counts[o.status]++;
    }
    return counts;
  });

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const f = this.filter();
    return this.views()
      .filter((o) => f === 'all' || o.status === f)
      .filter(
        (o) =>
          !q ||
          String(o.id).includes(q) ||
          o.client?.name?.toLowerCase().includes(q) ||
          o.client?.email?.toLowerCase().includes(q) ||
          o.client?.phone?.includes(q) ||
          o.notes?.toLowerCase().includes(q),
      )
      // Open orders first, by delivery date; delivered ones sink to the bottom.
      .sort(
        (a, b) =>
          Number(a.status === 'delivered') - Number(b.status === 'delivered') ||
          (a.date?.getTime() ?? Infinity) - (b.date?.getTime() ?? Infinity) ||
          b.id - a.id,
      );
  });

  protected readonly updating = signal<number | null>(null);

  protected readonly editorOpen = signal(false);
  /** The order being edited, or null when creating a new one. */
  protected readonly editing = signal<OrderView | null>(null);
  protected readonly saving = signal(false);
  protected readonly clients = signal<Client[]>([]);
  protected readonly clientMode = signal<ClientMode>('existing');
  protected readonly form = this.fb.group({
    clientId: this.fb.control<number | null>(null, Validators.required),
    name: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(PHONE_PATTERN)],
    deliveryDate: [''],
    notes: ['', Validators.maxLength(1000)],
  });

  constructor() {
    this.load();
  }

  ngOnInit(): void {
    const s = this.status();
    if (ORDER_STATUSES.some((x) => x.value === s)) this.filter.set(s as OrderStatus);
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.api
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.orders.set(list ?? []),
        error: () => this.loadFailed.set(true),
      });
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset();
    this.loadClients((list) => this.setClientMode(list.length ? 'existing' : 'new'));
    this.setClientMode('existing');
    this.editorOpen.set(true);
  }

  protected openEdit(order: OrderView): void {
    this.editing.set(order);
    this.form.reset({
      clientId: order.client?.id ?? null,
      deliveryDate: order.date ? toDateInput(order.date) : '',
      notes: order.notes ?? '',
    });
    this.loadClients();
    this.setClientMode('existing');
    this.editorOpen.set(true);
  }

  private loadClients(then?: (list: Client[]) => void): void {
    this.clientsApi.getAll().subscribe((list) => {
      const sorted = [...(list ?? [])].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'he'));
      this.clients.set(sorted);
      then?.(sorted);
    });
  }

  /** Disabled controls don't count toward validity, so only the active mode's fields are validated. */
  protected setClientMode(mode: ClientMode): void {
    this.clientMode.set(mode);
    const { clientId, name, email, phone } = this.form.controls;
    if (mode === 'existing') {
      clientId.enable();
      [name, email, phone].forEach((c) => c.disable());
    } else {
      clientId.disable();
      [name, email, phone].forEach((c) => c.enable());
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const existing = this.clientMode() === 'existing' ? this.clients().find((c) => c.id === v.clientId) : undefined;
    // The API links an order to an existing client by id. name/email are still sent because the DTO marks them required.
    const client: ClientInput = existing
      ? { id: existing.id, name: existing.name || '-', email: existing.email || '-' }
      : { name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim() || null };

    const current = this.editing();
    const body = { client, deliveryDate: v.deliveryDate || null, notes: v.notes.trim() || null };
    const request = current
      ? this.api.update(current.id, { ...body, id: current.id, status: current.status })
      : this.api.create({ ...body, status: 'new' });

    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe(() => {
      this.toast.success(current ? `הזמנה #${current.id} עודכנה` : `ההזמנה של ${existing?.name ?? client.name} נקלטה`);
      this.editorOpen.set(false);
      this.load();
    });
  }

  protected setStatus(order: OrderView, status: OrderStatus): void {
    if (status === order.status || !order.client) return;
    const { id, name, email, phone } = order.client;
    this.updating.set(order.id);
    this.api
      .update(order.id, {
        id: order.id,
        client: { id, name: name || '-', email: email || '-', phone },
        deliveryDate: order.deliveryDate,
        notes: order.notes,
        status,
      })
      .pipe(finalize(() => this.updating.set(null)))
      .subscribe(() => {
        this.orders.update((list) => list.map((o) => (o.id === order.id ? { ...o, status } : o)));
        this.toast.success(`הזמנה #${order.id}: ${statusLabel(status)}`);
      });
  }

  protected async remove(order: Order): Promise<void> {
    const ok = await this.confirm.ask({
      title: `ביטול הזמנה #${order.id}`,
      message: 'ההזמנה תימחק לצמיתות מהמערכת.',
      confirmText: 'מחיקת הזמנה',
      danger: true,
    });
    if (!ok) return;
    this.api.remove(order.id).subscribe(() => {
      this.orders.update((list) => list.filter((o) => o.id !== order.id));
      this.toast.success(`הזמנה #${order.id} נמחקה`);
    });
  }

  protected hasError(control: 'clientId' | 'name' | 'email' | 'phone', error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }
}
