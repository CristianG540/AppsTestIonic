import { Component } from '@angular/core';

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
