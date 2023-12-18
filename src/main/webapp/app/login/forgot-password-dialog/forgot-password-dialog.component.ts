import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { User } from 'app/entities/user/user.model';
import SharedModule from 'app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'mss-forgot-password-dialog',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {
  user: User | null = null;

  forgotPasswordForm = this.fb.group({
    email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public messageService: MessageService,
    private accountService: AccountService
  ) { }

  save(): void {
    if (!this.forgotPasswordForm.value.email) { return; }
    this.accountService.resetPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Pomyślnie zresetowano hasło użytkownika.', detail: 'Nowe hasło zostało wysłane pocztą elektroniczną' });
      },
      error: (res) => {
        const errorKey: string = res.error.message.split('.')[1];
        if(errorKey === 'emailnotfound'){
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Użytkownik o podanym mailu nie istnieje.' });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zresetować hasła użytkownika.' });
        }
      }
    });
  }
}
