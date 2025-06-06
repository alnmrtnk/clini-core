import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
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
      .post<{ data: AuthResponse }>(`${environment.apiUrl}Auth/login`, {
        email,
        password,
      })
      .pipe(
        map((res) => res.data),
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

  logout(withRedirection: boolean = true) {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('esculab_token');
    this.token.set(null);
    this.user.set(null);
    if (withRedirection) this.router.navigate(['/auth/login']);
  }

  validate() {
    const url = `${environment.apiUrl}Auth/validate`;
    return this.http.get(url);
  }
}
