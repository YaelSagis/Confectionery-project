import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PHONE_PATTERN, initials } from '../../core/format';
import { Client, ClientInput } from '../../core/models';
import { ClientService } from '../../core/services/api.services';
import { ConfirmService, ToastService } from '../../core/services/ui.services';
import { Icon } from '../../shared/icon';
import { Modal } from '../../shared/modal';

@Component({
  selector: 'app-clients',
  imports: [ReactiveFormsModule, Icon, Modal],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPage {
  private readonly api = inject(ClientService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly initials = initials;

  protected readonly clients = signal<Client[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.clients()
      .filter((c) => !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q))
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'he'));
  });

  protected readonly withPhone = computed(() => this.clients().filter((c) => c.phone).length);

  protected readonly editorOpen = signal(false);
  protected readonly editing = signal<Client | null>(null);
  protected readonly saving = signal(false);
  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(PHONE_PATTERN)],
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.api
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.clients.set(list ?? []),
        error: () => this.loadFailed.set(true),
      });
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset();
    this.editorOpen.set(true);
  }

  protected openEdit(client: Client): void {
    this.editing.set(client);
    this.form.reset({ name: client.name, email: client.email, phone: client.phone ?? '' });
    this.editorOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: ClientInput = { name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim() || null };
    const current = this.editing();
    const request = current ? this.api.update(current.id, { ...body, id: current.id }) : this.api.create(body);

    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe(() => {
      this.toast.success(current ? 'פרטי הלקוח עודכנו' : `${body.name} נוסף/ה לרשימת הלקוחות`);
      this.editorOpen.set(false);
      this.load();
    });
  }

  protected async remove(client: Client): Promise<void> {
    const ok = await this.confirm.ask({
      title: 'מחיקת לקוח',
      message: `למחוק את ${client.name} מרשימת הלקוחות?`,
      confirmText: 'מחיקה',
      danger: true,
    });
    if (!ok) return;
    this.api.remove(client.id).subscribe(() => {
      this.clients.update((list) => list.filter((c) => c.id !== client.id));
      this.toast.success('הלקוח נמחק');
    });
  }

  protected hasError(control: 'name' | 'email' | 'phone', error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }
}
