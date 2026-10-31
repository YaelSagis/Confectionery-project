import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { API_BASE } from '../config';
import { CatalogItem, Client, ClientInput, Order, OrderInput, Recipe, RecipeInput } from '../models';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class RecipeService extends CrudService<Recipe, RecipeInput> {
  protected readonly resource = 'Recipe';

  /** Anonymous: name + price only. */
  getCatalog(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${API_BASE}/Recipe/catalog`);
  }
}

@Injectable({ providedIn: 'root' })
export class OrderService extends CrudService<Order, OrderInput> {
  protected readonly resource = 'Order';

  /** Anonymous order from the public menu; the API always creates a new client for it. */
  createPublic(body: OrderInput): Observable<void> {
    return this.http.post<void>(`${API_BASE}/Order/public`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class ClientService extends CrudService<Client, ClientInput> {
  protected readonly resource = 'Client';

  /** Uses the anonymous GET api/Client/test endpoint as a health check. */
  ping(): Observable<boolean> {
    return this.http.get(`${API_BASE}/Client/test`, { responseType: 'text' }).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
