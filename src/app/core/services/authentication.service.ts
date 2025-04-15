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
  constructor(
    private readonly router: Router,
    private readonly socialAuthService: SocialAuthService
  ) {}

  loggedIn(): void {
    this.socialAuthService.authState.subscribe((auth) => {
      if (auth) {
        sessionStorage.setItem('jwt_token', auth.idToken);
        sessionStorage.setItem('name', auth.name);
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
    return sessionStorage.getItem('jwt_token');
  }

  logout(): void {
    this.clearSession();
    this.socialAuthService.signOut();
  }

  clearSession(): void {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('name');
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
