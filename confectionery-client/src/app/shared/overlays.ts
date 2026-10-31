import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmService, ToastKind, ToastService } from '../core/services/ui.services';
import { Icon, IconName } from './icon';

const TOAST_ICONS: Record<ToastKind, IconName> = { success: 'check', error: 'alert', info: 'sparkles' };

@Component({
  selector: 'app-toast-host',
  imports: [Icon],
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <button type="button" class="toast surface" [class]="t.kind" (click)="toast.dismiss(t.id)">
          <span class="toast-icon"><app-icon [name]="icons[t.kind]" [size]="18" /></span>
          <span>{{ t.text }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      inset-block-end: 24px;
      inset-inline-start: 50%;
      translate: 50% 0;
      z-index: 70;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: min(440px, calc(100vw - 32px));
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      border-radius: var(--radius-lg);
      font: inherit;
      color: var(--text);
      text-align: start;
      cursor: pointer;
      animation: toast-in 0.35s var(--ease);
    }
    .toast-icon {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: var(--tone);
      background: color-mix(in srgb, var(--tone) 14%, transparent);
    }
    .success { --tone: var(--success); }
    .error { --tone: var(--danger); }
    .info { --tone: var(--text); }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastHost {
  protected readonly toast = inject(ToastService);
  protected readonly icons = TOAST_ICONS;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [Icon],
  template: `
    @if (confirm.pending(); as req) {
      <div class="modal-root" (click)="confirm.answer(false)">
        <section
          class="dialog surface"
          role="alertdialog"
          aria-modal="true"
          [attr.aria-label]="req.title"
          (click)="$event.stopPropagation()"
        >
          <div class="badge-icon" [class.danger]="req.danger">
            <app-icon [name]="req.danger ? 'trash' : 'alert'" [size]="22" />
          </div>
          <h2>{{ req.title }}</h2>
          <p>{{ req.message }}</p>
          <div class="row">
            <button type="button" class="btn btn-ghost" (click)="confirm.answer(false)">ביטול</button>
            <button
              type="button"
              class="btn"
              [class.btn-danger]="req.danger"
              [class.btn-primary]="!req.danger"
              (click)="confirm.answer(true)"
            >
              {{ req.confirmText ?? 'אישור' }}
            </button>
          </div>
        </section>
      </div>
    }
  `,
  styles: `
    .modal-root {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: grid;
      place-items: center;
      padding: 16px;
      background: var(--overlay);
      backdrop-filter: blur(4px);
      animation: fade-in 0.2s ease;
    }
    .dialog {
      width: min(400px, 100%);
      padding: 32px 28px 24px;
      border-radius: var(--radius-xl);
      text-align: center;
      animation: pop-in 0.28s var(--ease);
    }
    .badge-icon {
      display: inline-grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      color: var(--text);
      border: 1px solid var(--border-strong);
    }
    .badge-icon.danger {
      color: var(--danger);
      border-color: color-mix(in srgb, var(--danger) 35%, transparent);
      background: color-mix(in srgb, var(--danger) 8%, transparent);
    }
    h2 { margin: 18px 0 8px; font-size: 1.35rem; }
    p { margin: 0 0 24px; color: var(--text-muted); }
    .row { display: flex; gap: 10px; justify-content: center; }
    .row .btn { flex: 1; }
  `,
  host: { '(document:keydown.escape)': 'confirm.pending() && confirm.answer(false)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  protected readonly confirm = inject(ConfirmService);
}
