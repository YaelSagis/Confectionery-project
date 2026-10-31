import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'app-modal',
  imports: [Icon],
  template: `
    @if (open()) {
      <div class="modal-root" (click)="onBackdrop($event)">
        <section class="dialog surface" [class.wide]="wide()" role="dialog" aria-modal="true" [attr.aria-label]="title()">
          <header class="dialog-head">
            <div>
              @if (eyebrow()) {
                <span class="eyebrow">{{ eyebrow() }}</span>
              }
              <h2>{{ title() }}</h2>
            </div>
            <button type="button" class="btn-icon" (click)="closed.emit()" aria-label="סגירה">
              <app-icon name="close" />
            </button>
          </header>
          <ng-content />
        </section>
      </div>
    }
  `,
  styles: `
    .modal-root {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: grid;
      place-items: center;
      padding: 16px;
      background: var(--overlay);
      backdrop-filter: blur(4px);
      animation: fade-in 0.2s ease;
    }
    .dialog {
      width: min(520px, 100%);
      max-height: calc(100dvh - 32px);
      overflow-y: auto;
      padding: 28px;
      border-radius: var(--radius-xl);
      animation: pop-in 0.28s var(--ease);
    }
    .dialog.wide {
      width: min(680px, 100%);
    }
    .dialog-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 22px;
    }
    h2 {
      margin: 4px 0 0;
      font-size: 1.5rem;
    }
  `,
  host: { '(document:keydown.escape)': 'open() && closed.emit()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly wide = input(false);
  readonly closed = output<void>();

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
