import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ReplaySubject } from 'rxjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let routerSpy: jasmine.SpyObj<Router>;
  let authState$: ReplaySubject<any>;
  let socialAuthServiceStub: Partial<SocialAuthService>;

  beforeEach(() => {
    authState$ = new ReplaySubject<any>(1);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    socialAuthServiceStub = {
      authState: authState$.asObservable(),
      signOut: jasmine.createSpy('signOut'),
      refreshAuthToken: jasmine.createSpy('refreshAuthToken')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: Router, useValue: routerSpy },
        { provide: SocialAuthService, useValue: socialAuthServiceStub }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    sessionStorage.clear();
  });

  it('should navigate to "/" and store token and username if user is logged in', () => {
    const mockAuth = { idToken: 'fake-token', name: 'John' };

    service.loggedIn();
    authState$.next(mockAuth);

    expect(sessionStorage.getItem('jwt_token_key')).toBe('fake-token');
    expect(sessionStorage.getItem('username_key')).toBe('John');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should clear session and navigate to "/login" if user is not logged in', () => {
    const clearSpy = spyOn(service, 'clearSession').and.callThrough();

    service.loggedIn();
    authState$.next(null);

    expect(clearSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
