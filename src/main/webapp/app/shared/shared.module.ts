import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { FormSectionWrapperComponent } from './components/form/form-decorator/form-section-wrapper.component';
import { FormSectionComponent } from './components/form/form-section/form-section.component';
import { FormControlComponent } from './components/form/form-control/form-control.component';
import { TableComponent } from './components/table/table.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { ToastModule } from 'primeng/toast';
import { DayShortcutPipe } from 'app/entities/day-shortcut.pipe';

/**
 * Application wide Module
 */
@NgModule({
  imports: [
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    TableModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    OverlayPanelModule,
    TooltipModule,
    SidebarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    TableModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    OverlayPanelModule,
    TooltipModule,
    SidebarModule,
    FormsModule,
    ReactiveFormsModule,
    FormComponent,
    FormSectionWrapperComponent,
    FormSectionComponent,
    FormControlComponent,
    TableComponent,
    AccountSettingsComponent,
    ToastModule,
    DayShortcutPipe
  ],
  declarations: [
    FormComponent,
    FormSectionWrapperComponent,
    FormSectionComponent,
    FormControlComponent,
    TableComponent,
    AccountSettingsComponent,
    DayShortcutPipe
  ],
})
export default class SharedModule { }
