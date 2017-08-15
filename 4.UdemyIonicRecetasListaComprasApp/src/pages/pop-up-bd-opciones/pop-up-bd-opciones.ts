import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

@Component({
  selector: 'pop-up-bd-opciones',
  templateUrl: 'pop-up-bd-opciones.html',
})
export class PopUpBdOpcionesPage {
  constructor(
    private viewCtrl: ViewController
  ) {}

  private onAction(accion): void {
    this.viewCtrl.dismiss({
      accion: accion
    });
  }

}
