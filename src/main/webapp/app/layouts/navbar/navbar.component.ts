import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import NavbarItem from './navbar-item.model';
import { Tabs } from './tabs';
import _ from 'lodash';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountSettingsComponent } from 'app/shared/components/account-settings/account-settings.component';
import { MessageService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'mss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterModule, SharedModule, HasAnyAuthorityDirective],
  providers: [DialogService]
})
export default class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = false;
  version = '';
  account: Account | null = null;
  tabs: NavbarItem[] = [];
  filteredTabs: NavbarItem[] = [];
  sidebarVisible = true;
  filterValue = '';
  userIdentity: Account | null = null;
  toggleCount = 0;

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private router: Router,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.userIdentity = this.accountService.getIdentity();
  }

  ngOnInit(): void {
    this.tabs = Tabs;
    this.filter();
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }

  filter(): void {
    this.filteredTabs = _.cloneDeep(this.tabs.filter(tab => tab.name.toLowerCase().includes(this.filterValue.toLowerCase())));
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.toggleCount++;
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    this.filterValue = '';
  }

  getUserFullName(): string {
    if (this.account?.firstName && this.account.lastName) {
      return this.account.firstName + ' ' + this.account.lastName;
    }
    return '';
  }

  getUserInfoClass(): string {
    if (this.toggleCount === 0 && !this.isNavbarCollapsed) {
      return '';
    } else if (this.toggleCount !== 0 && !this.isNavbarCollapsed) {
      return 'uncollapsed';
    }
    return 'collapsed';
  }

  showUserSettings(): void {
    const ref: DynamicDialogRef = this.dialogService.open(AccountSettingsComponent, {
      header: 'Zmień hasło',
    });
    ref.onClose.subscribe(success => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Hasło zostało zmienione pomyślnie.' });
      } else if (success === false) {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zmienić hasła.' });
      }
    });
  }
}
