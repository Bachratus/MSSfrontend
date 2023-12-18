import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'mss-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.scss']
})
export class FormSectionComponent {
  constructor(public elementRef: ElementRef) {}
}
