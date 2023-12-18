import { UserService } from './../../entities/user/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'app/entities/user/user.model';
import { UniversalTableColumn } from 'app/shared/components/table/table.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'mss-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DialogService],
})
export class UsersComponent implements OnInit {
  selectedUser: User | null = null;
  users: User[] = [];
  loading = false;

  cols: UniversalTableColumn[] = [
    { field: 'login', header: 'Login' },
    { field: 'firstName', header: 'Imię' },
    { field: 'lastName', header: 'Nazwisko' },
    { field: 'email', header: 'Email' },
  ];

  constructor(
    private userService: UserService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: response => {
        this.users = response;
        if(this.selectedUser){
          const id = this.selectedUser.id;
          this.selectedUser = this.users.find(user => user.id === id)!;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  addNewUser(): void {
    const ref: DynamicDialogRef = this.dialogService.open(UsersDialogComponent, {
      header: 'Dodaj użytkownika',
    });

    ref.onClose.subscribe(result => {
      if (result.success && !result.edit) {
        this.loadUsers();
      }
    });
  }

  editUser():void{
    const ref: DynamicDialogRef = this.dialogService.open(UsersDialogComponent, {
      header: 'Edytuj użytkownika',
      data:{
        user: this.selectedUser
      }
    });

    ref.onClose.subscribe(result => {
      if (result.success && result.edit) {
        this.loadUsers();
      }
    });
  }

  deleteUser(): void {
    if (this.selectedUser) {
      this.confirmationService.confirm({
        message: 'Czy na pewno chcesz usunąć tego użytkownika?',
        header: 'Potwierdź usunięcie',
        acceptLabel: 'Tak',
        rejectLabel: 'Nie',
        accept: () => {
          this.userService.deleteUser(this.selectedUser!.login).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie usunięto użytkownika.' });
              this.selectedUser = null;
              this.loadUsers();
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć użytkownika.' });
            }
          });
        }
      });
    }
  }
}
