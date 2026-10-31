import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_BASE } from '../config';
import { JwtToken, LoginRequest } from '../models';

const TOKEN_KEY = 'dolce.token';
// JwtSecurityTokenHandler shortens ClaimTypes.NameIdentifier to "nameid" when writing the token.
const NAME_CLAIMS = ['nameid', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

interface JwtPayload {
  exp?: number;
  [claim: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _token = signal<string | null>(readStoredToken());

  readonly token = this._token.asReadonly();
  private readonly payload = computed(() => decodePayload(this._token()));

  readonly isLoggedIn = computed(() => {
    const p = this.payload();
    return !!p && (!p.exp || p.exp * 1000 > Date.now());
  });

  readonly userName = computed(() => {
    const p = this.payload();
    const claim = p && NAME_CLAIMS.map((c) => p[c]).find((v) => typeof v === 'string');
    return (claim as string | undefined) ?? null;
  });

  login(request: LoginRequest): Observable<void> {
    return this.http.post<JwtToken>(`${API_BASE}/Auth/login`, request).pipe(
      tap((res) => this.setToken(res.token)),
      map(() => undefined),
    );
  }

  logout(): void {
    this.setToken(null);
  }

  private setToken(token: string | null): void {
    this._token.set(token);
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage can be unavailable (private mode); the session still works in memory.
    }
  }
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function decodePayload(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload;
  } catch {
    return null;
  }
}
