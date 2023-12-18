import { NgModule } from '@angular/core';
import { AuthoritiesComponent } from './authorities.component';
import SharedModule from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [AuthoritiesComponent],
  exports: [AuthoritiesComponent]
})
export class AuthoritiesModule { }
