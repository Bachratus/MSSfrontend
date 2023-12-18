import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Authority } from 'app/entities/authority/authority.model';
import { AuthorityService } from 'app/entities/authority/authority.service';
import { User } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { UniversalTableColumn } from 'app/shared/components/table/table.model';

@Component({
  selector: 'mss-authorities',
  templateUrl: './authorities.component.html',
  styleUrls: ['./authorities.component.scss']
})
export class AuthoritiesComponent implements OnInit {
  loadingUsers = false;
  loadingAuthorities = false;
  authorities: Authority[] = [];
  users: User[] = [];

  selectedUser: User | null = null;
  selectedAuthorities: Authority[] = [];

  usersCols: UniversalTableColumn[] = [
    { field: 'firstName', header: 'Imię' },
    { field: 'lastName', header: 'Nazwisko' },
    { field: 'login', header: 'Login' }
  ];

  authoritiesCols: UniversalTableColumn[] = [
    { field: 'description', header: 'Uprawnienie' }
  ];

  constructor(
    private authorityService: AuthorityService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadAuthorities();
    this.loadUsers();
  }

  loadAuthorities(): void {
    this.selectedAuthorities = [];
    this.loadingAuthorities = true;
    this.authorityService.getAllAuthorities().subscribe({
      next: response => {
        this.authorities = response.body ?? [];
        this.loadingAuthorities = false;
      },
      error: () => {
        this.loadingAuthorities = false;
      },
    });
  }

  loadUsers(): void {
    this.selectedUser = null;
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: response => {
        this.users = response;
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
      },
    });
  }

  loadAuthoritiesForUser(): void {
    if (!this.selectedUser?.id) { return };
    this.authorityService.getAllForUser(this.selectedUser.id).subscribe({
      next: (res) => {
        this.selectedAuthorities = res.body ?? [];
      }
    })
  }

  onUserSelectinChange(user: User | null): void {
    if (!user) {
      this.selectedAuthorities = [];
    } else {
      this.loadAuthoritiesForUser()
    }
  }

  save(): void {
    if (!this.selectedUser?.id) { return; }
    this.userService.updateUserAuthorities(this.selectedUser.id, this.selectedAuthorities).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie zaktualizowano uprawnienia użytkownika.' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zaktualizować uprawnień użytkownika.' });
      },
    })
  }
}
