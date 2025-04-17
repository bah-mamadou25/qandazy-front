import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { jwtDecode } from 'jwt-decode';
import {catchError, from, Observable, of, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly jwt_token_key: string='jwt_token_key';
  private readonly username_key: string='username_key';
  constructor(
    private readonly router: Router,
    private readonly socialAuthService: SocialAuthService
  ) {}

  loggedIn(): void {
    this.socialAuthService.authState.subscribe((auth) => {
      if (auth) {
        sessionStorage.setItem(this.jwt_token_key, auth.idToken);
        sessionStorage.setItem(this.username_key, auth.name);
        this.router.navigate(['/']);
      } else {
        this.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.jwt_token_key);
  }

  getUsername(): string | null {
    return sessionStorage.getItem(this.username_key);
  }

  logout(): void {
    this.clearSession();
    this.socialAuthService.signOut();
  }

  clearSession(): void {
    sessionStorage.removeItem('jwt_token_key');
    sessionStorage.removeItem('username_key');
  }

  isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now().valueOf() / 1000;
      return decoded.exp - now < 10; // expired or less than 10 seconds to expiration
    } catch (e) {
      return true;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now().valueOf() / 1000;
      return decoded.exp < now;
    } catch (e) {
      return true;
    }
  }

  refreshToken(): Observable<string | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    return from(this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID)).pipe(
      switchMap(() => {
        const newToken = this.getToken();
        if (newToken && !this.isTokenExpiringSoon(newToken)) {
          return of(newToken);
        } else {
          this.logout();
          return of(null);
        }
      }),
      catchError((error) => {
        console.error('Error refreshing token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }
}
