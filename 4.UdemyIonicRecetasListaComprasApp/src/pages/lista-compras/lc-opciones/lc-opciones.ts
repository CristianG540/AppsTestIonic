import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

@Component({
  selector: 'page-lc-opciones',
  templateUrl: 'lc-opciones.html',
})
export class ListaComprasOpcionesPage {
  constructor(
    private viewCtrl: ViewController
  ) {}

  private onAction(accion): void {
    this.viewCtrl.dismiss({
      accion: accion
    });
  }

}
