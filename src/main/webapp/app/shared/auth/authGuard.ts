import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

export function canActivateGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  const accountService: AccountService = inject(AccountService);
  const router: Router = inject(Router);
  const loginService: LoginService = inject(LoginService);

  let isAuthenticated = false;

  const expectedRoles: string[] = route.data.roles;

  return accountService.identity().pipe(
    switchMap((res) => {
      if (res === null) {
        const err = new Error('test');
        return throwError(() => err);
      }
      isAuthenticated = true;
      const navigateToLogin: boolean | null = tryNavigateToLogin(state.url, isAuthenticated);
      if (navigateToLogin === false) {
        navigateToBaseForUser(loginService, accountService, router);
        return of(false as boolean);
      } else { // navigateToLogin === null
        const hasExpectedRole = accountService.hasAnyAuthority(expectedRoles);
        if (hasExpectedRole) {
          return of(true);
        } else {
          router.navigate(['accessdenied']);
          return of(false as boolean);
        }
      }
    }),
    catchError(() => {
      const navigateToLogin: boolean | null = tryNavigateToLogin(state.url, isAuthenticated);
      if (navigateToLogin) {
        return of(true);
      } else { // navigateToLogin === null
        router.navigate(['accessdenied']);
        return of(false as boolean);
      }
    })
  );
}

const tryNavigateToLogin = (stateUrl: string, isAuthenticated: boolean): boolean | null => {
  if ((stateUrl === '' || stateUrl === '/') && !isAuthenticated) {
    return true;
  } else if ((stateUrl === '' || stateUrl === '/')) {
    return false;
  } else {
    return null;
  }
}

const navigateToBaseForUser = (loginService: LoginService, accountService: AccountService, router: Router): void => {
  router.navigate([loginService.getNavigationPathBasedOnRoles(accountService.getIdentity()?.authorities)]);
}
