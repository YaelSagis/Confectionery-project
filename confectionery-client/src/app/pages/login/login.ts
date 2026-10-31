import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/ui.services';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  /** Bound from the ?returnUrl= query param via withComponentInputBinding. */
  readonly returnUrl = input<string>();

  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.submitting.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`ברוכים הבאים, ${this.auth.userName() ?? ''}`);
          const target = this.returnUrl();
          this.router.navigateByUrl(target?.startsWith('/') && !target.startsWith('//') ? target : '/admin');
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err.status === 401 ? 'שם המשתמש או הסיסמה שגויים' : 'לא הצלחנו להתחבר כרגע, נסו שוב');
        },
      });
  }

  protected fillDemo(): void {
    this.form.setValue({ userName: 'test', password: 'password' });
    this.error.set(null);
  }
}
