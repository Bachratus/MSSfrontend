import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { LoginService } from 'app/login/login.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'mss-login',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
  providers: [DialogService]
})
export default class LoginComponent {
  showPassword = false;
  authenticationError = false;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: account => {
        this.authenticationError = false;
        // if (!this.router.getCurrentNavigation()) {
        //   // There were no routing during login (eg from navigationToStoredUrl)
        // }
        const navigateTo: string = this.loginService.getNavigationPathBasedOnRoles(account?.authorities);
        this.router.navigate([navigateTo]);
      },
      error: (res) => {
        this.authenticationError = true;
        const errorKey: string = res.error.message.split('.')[1];
        if (errorKey === 'usernotactive') {
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'To konto jest nieaktywne' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zalogować' });
        }
      }
    });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  showForgotPasswordDialog(): void {
    this.dialogService.open(ForgotPasswordDialogComponent, {
      header: 'Zapomniałem hasła',
    });
  }
}
