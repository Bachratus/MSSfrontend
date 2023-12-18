import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import SharedModule from 'app/shared/shared.module';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';

@NgModule({
  imports:[
    SharedModule
  ],
  declarations: [
    UsersComponent,
    UsersDialogComponent
  ],
  exports:[
    UsersComponent
  ]
})
export class UsersModule { }
