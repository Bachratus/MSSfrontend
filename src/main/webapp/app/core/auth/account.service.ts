import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordChangeModel } from 'app/entities/user/passwordChangeModel.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;
  private BASE_URL: string = this.applicationConfigService.getEndpointFor('api/account');

  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService
  ) { }

  save(account: Account): Observable<{}> {
    return this.http.post(`${this.BASE_URL}`, account);
  }

  changePassword(passwordChangeModel: PasswordChangeModel): Observable<HttpResponse<{}>> {
    return this.http.post(`${this.BASE_URL}/change-password`, passwordChangeModel, { observe: 'response' });
  }

  resetPassword(email: string): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.BASE_URL}/forgot-password/${email}`, { observe: 'response' });
  }

  getIdentity(): Account | null {
    return this.userIdentity;
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account);

          this.navigateToStoredUrl();
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
