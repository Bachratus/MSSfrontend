import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AccountService } from 'app/core/auth/account.service';
import { PasswordChangeModel } from 'app/entities/user/passwordChangeModel.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'mss-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {
  showCurrentPassword = false;
  showNewPassword = false;

  resetPasswordForm = this.fb.group({
    currentPassword: [{ value: '', disabled: false }, Validators.required],
    newPassword: [{ value: '', disabled: false }, Validators.required],
    newPasswordConfirm: [{ value: '', disabled: false }, Validators.required]
  }, { validators: this.passwordMatchValidator });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('newPassword')!.value;
    const confirmPassword = formGroup.get('newPasswordConfirm')!.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  changePassword(): void {
    if (
      this.resetPasswordForm.value.currentPassword &&
      this.resetPasswordForm.value.newPassword &&
      this.resetPasswordForm.value.newPasswordConfirm
    ) {
      const passwordChangeModel = new PasswordChangeModel(
        this.resetPasswordForm.value.currentPassword,
        this.resetPasswordForm.value.newPassword,
      )

      this.accountService.changePassword(passwordChangeModel).subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: () => {
          this.ref.close(false);
        },
      })
    }
  }

  toggleShowCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }
}
