import { Component, Input } from '@angular/core';

@Component({
  selector: 'mss-form-section-wrapper',
  templateUrl: './form-section-wrapper.component.html',
  styleUrls: ['./form-section-wrapper.component.scss'],
})
export class FormSectionWrapperComponent {
  @Input() twoColumns!: boolean;
}
