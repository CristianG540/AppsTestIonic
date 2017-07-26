import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  num: number;
  mayorMenor: string = '...';
  numSecret: number = this.numAleatorio(0,100);
  constructor(public navCtrl: NavController) {
    
  }
  numAleatorio(a, b) {
    return Math.round(Math.random() * (b - a) + parseInt(a));
  }
  compruebaNumero() {
    if (this.num) {
      if (this.numSecret < this.num) {
        this.mayorMenor = 'menor';
      }
      else if (this.numSecret > this.num) {
        this.mayorMenor = 'mayor';
      }
      else {
        this.mayorMenor = 'igual';
      }
    }
  }
  reinicia() {
    // reiniciamos las variables
    this.num = null;
    this.mayorMenor = '...';
    this.numSecret = this.numAleatorio(0, 100);
  }

}
