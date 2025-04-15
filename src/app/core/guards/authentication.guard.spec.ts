import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthenticationGuard,
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should redirect to login when not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
