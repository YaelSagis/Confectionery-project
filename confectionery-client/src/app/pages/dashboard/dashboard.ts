import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { lines } from '../../core/format';
import { Recipe } from '../../core/models';
import { OrderView, daysFromToday, statusLabel, toOrderView } from '../../core/orders';
import { ClientService, OrderService, RecipeService } from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';
import { Icon, IconName } from '../../shared/icon';
import { Pastry } from '../../shared/pastry';

interface Stat {
  label: string;
  value: number;
  icon: IconName;
  hint: string;
  link: string;
  query?: Record<string, string>;
  highlight?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, Icon, Pastry],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly auth = inject(AuthService);
  private readonly recipesApi = inject(RecipeService);
  private readonly ordersApi = inject(OrderService);
  private readonly clientsApi = inject(ClientService);

  protected readonly statusLabel = statusLabel;
  protected readonly today = new Date();
  protected readonly greeting = greetingFor(this.today.getHours());

  protected readonly loading = signal(true);
  protected readonly online = signal<boolean | null>(null);
  private readonly recipes = signal<Recipe[]>([]);
  private readonly orders = signal<OrderView[]>([]);
  private readonly clientCount = signal(0);

  /** New orders waiting for someone to pick them up, oldest delivery date first. */
  protected readonly newOrders = computed(() =>
    this.orders()
      .filter((o) => o.status === 'new')
      .sort((a, b) => (a.date?.getTime() ?? Infinity) - (b.date?.getTime() ?? Infinity)),
  );

  /** Open orders due within the next week (including overdue ones that weren't delivered). */
  protected readonly upcoming = computed(() =>
    this.orders()
      .filter((o) => o.status !== 'delivered' && o.date && daysFromToday(o.date) <= 7)
      .sort((a, b) => a.date!.getTime() - b.date!.getTime()),
  );

  protected readonly missingRecipe = computed(() =>
    this.recipes().filter((r) => !lines(r.ingredients).length && !lines(r.instructions).length),
  );

  protected readonly stats = computed<Stat[]>(() => {
    const dueToday = this.upcoming().filter((o) => daysFromToday(o.date!) <= 0).length;
    return [
      {
        label: 'הזמנות חדשות',
        value: this.newOrders().length,
        icon: 'receipt',
        hint: 'ממתינות לטיפול',
        link: '/admin/orders',
        query: { status: 'new' },
        highlight: this.newOrders().length > 0,
      },
      { label: 'למסירה היום', value: dueToday, icon: 'calendar', hint: 'כולל באיחור', link: '/admin/orders' },
      { label: 'מתכונים', value: this.recipes().length, icon: 'cake', hint: 'לקטלוג', link: '/admin/recipes' },
      { label: 'לקוחות', value: this.clientCount(), icon: 'users', hint: 'לרשימה', link: '/admin/clients' },
    ];
  });

  constructor() {
    forkJoin({
      online: this.clientsApi.ping(),
      recipes: this.recipesApi.getAll().pipe(catchError(() => of([]))),
      orders: this.ordersApi.getAll().pipe(catchError(() => of([]))),
      clients: this.clientsApi.getAll().pipe(catchError(() => of([]))),
    }).subscribe(({ online, recipes, orders, clients }) => {
      this.online.set(online);
      this.recipes.set(recipes ?? []);
      this.orders.set((orders ?? []).map(toOrderView));
      this.clientCount.set(clients?.length ?? 0);
      this.loading.set(false);
    });
  }

  protected dueLabel(order: OrderView): string {
    if (!order.date) return 'ללא תאריך';
    const days = daysFromToday(order.date);
    if (days < 0) return 'באיחור';
    if (days === 0) return 'היום';
    if (days === 1) return 'מחר';
    return `בעוד ${days} ימים`;
  }

  /** First line of the order contents, for a one-line preview. */
  protected summary(order: OrderView): string {
    return order.notes?.split('\n')[0] ?? '';
  }
}

function greetingFor(hour: number): string {
  if (hour < 12) return 'בוקר טוב';
  if (hour < 17) return 'צהריים טובים';
  return 'ערב טוב';
}
