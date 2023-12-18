import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'mss-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})
export class UsersDialogComponent implements OnInit {
  user: User | null = null;

  registerForm = this.fb.group({
    login: [{ value: '', disabled: false }, Validators.required],
    firstName: [{ value: '', disabled: false }, Validators.required],
    lastName: [{ value: '', disabled: false }, Validators.required],
    email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.user = this.config.data.user;
    if (this.user) {
      this.registerForm.patchValue(this.user)
    }
  }

  save(): void {
    const { login, firstName, lastName, email } = this.registerForm.value;
    if (login && firstName && lastName && email) {
      const user = new User(
        this.user?.id ?? null,
        login,
        firstName,
        lastName,
        email
      );
      if (!user.id) {
        this.userService.registerUser(user).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie dodano użytkownika.' });
            this.ref.close({ success: true, edit: false });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać użytkownika.' });
          }
        })
      } else {
        this.userService.updateUser(user).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie edytowano użytkownika.' });
            this.ref.close({ success: true, edit: true });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się edytować użytkownika.' });
          }
        })
      }
    }
  }
}
