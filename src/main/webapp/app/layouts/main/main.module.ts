import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import MainComponent from './main.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [MainComponent],
  providers: [MessageService, ConfirmationService]
})
export default class MainModule { }
