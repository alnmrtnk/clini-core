import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenKey = 'clini_jwt';
  private userKey = 'clini_user';

  readonly token = signal<string | null>(localStorage.getItem(this.tokenKey));
  private user = signal<{ id: string; email: string } | null>(
    JSON.parse(localStorage.getItem(this.userKey) || 'null')
  );

  readonly isLoggedIn = computed(() => !!this.token());
  readonly currentUserId = computed(() => this.user()?.id ?? null);
  readonly currentUserEmail = computed(() => this.user()?.email ?? null);

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}Auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(
            this.userKey,
            JSON.stringify({ id: res.userId, email: res.email })
          );
          this.token.set(res.token);
          this.user.set({ id: res.userId, email: res.email });
        })
      );
  }

  register(email: string, password: string, fullName: string) {
    return this.http.post<void>(`${environment.apiUrl}Auth/register`, {
      email,
      password,
      fullName,
    });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.token.set(null);
    this.user.set(null);
  }

  get authHeader() {
    return { Authorization: `Bearer ${this.token()}` };
  }
}
