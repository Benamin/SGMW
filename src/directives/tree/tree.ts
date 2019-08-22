import { Directive } from '@angular/core';

@Directive({
  selector: '[tree]' // Attribute selector
})
export class TreeDirective {

  constructor() {
    console.log('Hello TreeDirective Directive');
  }

}
