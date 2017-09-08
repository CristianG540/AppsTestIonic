import { Component } from '@angular/core';

/**
 * Generated class for the NumberPickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'number-picker',
  templateUrl: 'number-picker.html'
})
export class NumberPickerComponent {

  text: string;

  constructor() {
    console.log('Hello NumberPickerComponent Component');
    this.text = 'Hello World';
  }

}
