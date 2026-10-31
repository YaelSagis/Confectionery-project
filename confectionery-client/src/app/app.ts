import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { initials } from './core/format';
import { SITE } from './core/site';
import { AuthService } from './core/services/auth.service';
import { ThemeService, ToastService } from './core/services/ui.services';
import { Icon, IconName } from './shared/icon';
import { ConfirmDialog, ToastHost } from './shared/overlays';

interface NavLink {
  path: string;
  label: string;
  icon: IconName;
  exact?: boolean;
}

const PUBLIC_LINKS: NavLink[] = [
  { path: '/', label: 'בית', icon: 'home', exact: true },
  { path: '/menu', label: 'תפריט והזמנה', icon: 'cake' },
];

const STAFF_LINKS: NavLink[] = [
  { path: '/admin', label: 'לוח בקרה', icon: 'home', exact: true },
  { path: '/admin/recipes', label: 'מתכונים', icon: 'cake' },
  { path: '/admin/orders', label: 'הזמנות', icon: 'receipt' },
  { path: '/admin/clients', label: 'לקוחות', icon: 'users' },
  { path: '/menu', label: 'האתר ללקוחות', icon: 'arrow' },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, ToastHost, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly menuOpen = signal(false);
  protected readonly year = new Date().getFullYear();
  protected readonly userInitials = computed(() => initials(this.auth.userName()));
  protected readonly site = SITE;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  /** Staff pages keep the compact app layout; public pages are full-width with the site footer. */
  protected readonly isAdmin = computed(() => this.url().startsWith('/admin') || this.url().startsWith('/login'));

  /** Customers see the public site; signed-in staff get the management menu. */
  protected readonly links = computed(() => (this.auth.isLoggedIn() ? STAFF_LINKS : PUBLIC_LINKS));

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  protected logout(): void {
    this.auth.logout();
    this.toast.info('התנתקת בהצלחה');
    this.router.navigateByUrl('/');
  }
}
