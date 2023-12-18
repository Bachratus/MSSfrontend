import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'mss-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Output() formSubmition = new EventEmitter();
  @Input() saveLabel = 'Zapisz';
  @Input() formGroup!: FormGroup;
  @Input() twoColumns = false;

  emitSubmit(): void {
    this.formSubmition.emit();
  }
}
