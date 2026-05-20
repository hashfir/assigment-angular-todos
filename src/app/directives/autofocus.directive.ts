import { Directive, ElementRef, inject } from '@angular/core';
import { afterNextRender } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  constructor() {
    const el = inject(ElementRef);
    afterNextRender(() => {
      el.nativeElement.focus();
    });
  }
}
